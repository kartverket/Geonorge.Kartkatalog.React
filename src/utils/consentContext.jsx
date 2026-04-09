import { createContext, useEffect, useState, useRef } from "react";
import posthog from "posthog-js";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import { getConfig } from "@/utils/runtimeConfig";

const defaultConsent = {
    analytics: false,
    functional: false,
    performance: false,
    advertisement: false,
};

const ConsentContext = createContext(defaultConsent);
const consentCategoryKeys = Object.keys(defaultConsent);

const normalizeConsent = ({ categories = {}, accepted } = {}) => {
    const acceptedValues = Array.isArray(accepted) ? accepted : null;

    return consentCategoryKeys.reduce((normalizedConsent, categoryKey) => {
        normalizedConsent[categoryKey] = acceptedValues
            ? acceptedValues.includes(categoryKey)
            : !!categories?.[categoryKey];

        return normalizedConsent;
    }, { ...defaultConsent });
};

const getInitialConsent = () => {
    if (typeof window === "undefined" || !window.getCkyConsent) {
        return defaultConsent;
    }

    const existingConsent = window.getCkyConsent();

    if (!existingConsent?.isUserActionCompleted) {
        return defaultConsent;
    }

    return normalizeConsent({ categories: existingConsent.categories });
};

export function ConsentProvider({ children }) {
    const [consent, setConsent] = useState(getInitialConsent);
    const hasInitPosthog = useRef(false);

    useEffect(() => {
        if (consent.analytics) {
            const posthogKey = getConfig("VITE_POSTHOG_KEY", "");
            const posthogHost = getConfig("VITE_POSTHOG_HOST", "");

            if (!posthogKey || !posthogHost) {
                return;
            }

            if (!hasInitPosthog.current) {
                posthog.init(posthogKey, {
                    api_host: posthogHost,
                    ui_host: "https://eu.posthog.com",
                    autocapture: false,
                    capture_pageview: false,
                    opt_out_capturing_by_default: true,
                    session_idle_timeout_seconds: 60 * 10,
                    capture_exceptions: window.location.hostname !== "localhost",
                    session_recording: {
                        session_idle_threshold_ms: 3 * 60 * 1000
                    }
                });
                hasInitPosthog.current = true;
            }

            posthog.opt_in_capturing({
                autocapture: true,
                capture_pageview: true
            });
        } else if (hasInitPosthog.current) {
            posthog.opt_out_capturing({
                autocapture: false,
                capture_pageview: false
            });
        }
    }, [consent.analytics]);

    useEffect(() => {
        function handleBannerLoad(event) {
            setConsent(normalizeConsent({ categories: event?.detail?.categories }));
        }

        function handleConsentUpdate(event) {
            setConsent(normalizeConsent({ accepted: event?.detail?.accepted }));
        }

        document.addEventListener("cookieyes_banner_load", handleBannerLoad);
        document.addEventListener("cookieyes_consent_update", handleConsentUpdate);


        return () => {
            document.removeEventListener("cookieyes_banner_load", handleBannerLoad);
            document.removeEventListener("cookieyes_consent_update", handleConsentUpdate);
        };
    }, []);

    return (
        <ConsentContext.Provider value={consent}>
            <PostHogProvider client={posthog}>
                <PostHogErrorBoundary>
                    {children}
                </PostHogErrorBoundary>
            </PostHogProvider>
        </ConsentContext.Provider>
    );
}
