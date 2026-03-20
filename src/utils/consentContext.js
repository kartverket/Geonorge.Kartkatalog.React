import { createContext, useContext, useEffect, useState, useRef } from "react";
import posthog from "posthog-js";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";

const defaultConsent = {
    analytics: false,
    functional: false,
    performance: false,
    advertisement: false,
};

const ConsentContext = createContext(defaultConsent);

export function ConsentProvider({ children }) {
    const [consent, setConsent] = useState(defaultConsent);
    const hasInitPosthog = useRef(false);

    useEffect(() => {
        if (!hasInitPosthog.current && !posthog.__loaded) {
            posthog.init(process.env.REACT_APP_POSTHOG_KEY, {
                api_host: process.env.REACT_APP_POSTHOG_HOST,
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
    }, []);

    useEffect(() => {
        if (consent.analytics) {
            posthog.opt_in_capturing({
                autocapture: true,
                capture_pageview: true
            });
        } else {
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

        // Handle the case where banner_load already fired before React mounted
        if (window.getCkyConsent) {
            const existing = window.getCkyConsent();
            if (existing?.isUserActionCompleted) {
                setConsent({
                    analytics:     existing.categories.analytics,
                    functional:    existing.categories.functional,
                    performance:   existing.categories.performance,
                    advertisement: existing.categories.advertisement,
                });
            }
        }

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