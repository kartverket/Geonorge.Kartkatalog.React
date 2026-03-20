import { createContext, useContext, useEffect, useState, useRef } from "react";
import posthog from "posthog-js";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import { getConfig } from "utils/runtimeConfig";

const defaultConsent = {
    analytics: false,
    functional: false,
    performance: false,
    advertisement: false,
};

const ConsentContext = createContext(defaultConsent);

const getInitialConsent = () => {
    if (typeof window === "undefined" || !window.getCkyConsent) {
        return defaultConsent;
    }

    const existingConsent = window.getCkyConsent();

    if (!existingConsent?.isUserActionCompleted) {
        return defaultConsent;
    }

    return {
        analytics: !!existingConsent.categories?.analytics,
        functional: !!existingConsent.categories?.functional,
        performance: !!existingConsent.categories?.performance,
        advertisement: !!existingConsent.categories?.advertisement,
    };
};

export function ConsentProvider({ children }) {
    const [consent, setConsent] = useState(getInitialConsent);
    const hasInitPosthog = useRef(false);

    useEffect(() => {
        if (consent.analytics) {
            const posthogKey = getConfig("REACT_APP_POSTHOG_KEY", "");
            const posthogHost = getConfig("REACT_APP_POSTHOG_HOST", "");

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
            const { categories } = event.detail;
            setConsent({
                analytics:     categories.analytics,
                functional:    categories.functional,
                performance:   categories.performance,
                advertisement: categories.advertisement,
            });
        }

        function handleConsentUpdate(event) {
            const { accepted } = event.detail;
            setConsent({
                analytics:     accepted.includes("analytics"),
                functional:    accepted.includes("functional"),
                performance:   accepted.includes("performance"),
                advertisement: accepted.includes("advertisement"),
            });
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

export const useConsent = () => useContext(ConsentContext);