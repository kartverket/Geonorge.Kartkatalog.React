import React, { useState, useEffect } from "react";
import { getGeonorgeRegisterApiUrl } from "actions/ApiUrlActions";
import styles from "components/partials/Alertbox.module.scss";

const AlertBox = ({ uuid }) => {
  const [alert, setAlert] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const apiUrl = getGeonorgeRegisterApiUrl()();
  const lengthInDays = 30;

  useEffect(() => {
    let isCancelled = false;

    // Fetch alert data
    const fetchAlert = async () => {
      try {
        
        const response = await fetch(`${apiUrl}/alerts/${uuid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch alert");
        }
        
        let data = (await response.json());
        
        // order by effective date descending
        data.sort((a, b) => new Date(b.EffectiveDate) - new Date(a.EffectiveDate));

        // TODO: Handle multiple alerts
        data = data[0];

        if (isCancelled) return;

        const alertDate = new Date(data.AlertDate);
        const effectiveDate = new Date(data.EffectiveDate);
        const currentDate = new Date();

        const visibleUntil = new Date(effectiveDate);
        visibleUntil.setDate(visibleUntil.getDate() + lengthInDays);

        // Determine visibility
        const shouldShowAlert =
          currentDate >= alertDate && currentDate <= visibleUntil;

        setIsVisible(shouldShowAlert);
        setAlert(data);

      } catch (error) {
        console.error("Error fetching alert:", error);
      }
    };

    fetchAlert();

    return () => {
      isCancelled = true;
    };

  }, [uuid, apiUrl]);

  if (!isVisible || !alert) {
    return null; // Don't render if not visible
  }

  return (
    <div className={styles.alertContainer}>
      <div className={styles.alertContent}>
        <div>
          <div>
            {new Date(alert.AlertDate).toLocaleDateString("no-NB", {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric'
            })}
          </div>
          <div className={styles.alertText}>
            <strong>Varsel:</strong> Det vil bli gjort endringer i {alert.AlertCategory == "Tjenestevarsel" ? "denne tjenesten" : "dette datasettet"} fra {new Date(alert.EffectiveDate).toLocaleDateString("no-NB", {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric'
            })}
          </div>
        </div>
        <div className={styles.alertLink}>
          <br />
          <a
            href={`${apiUrl.replace("api", "varsler")}/${cleanString(alert.Label)}/${alert.SystemId}`}
          >
            Gå til detaljert varsel
          </a>
        </div>
      </div>
    </div>
  );
};

// Used for cleaning label name for URL - can be anything, but nice to be somewhat consistent
const cleanString = (input) => {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};


export default AlertBox;
