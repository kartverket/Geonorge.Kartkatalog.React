import React from "react";
import PropTypes from "prop-types";
import { Card } from "@digdir/designsystemet-react";
import DistributionAccordionItem from "@/components/routes/Metadata/DistributionAccordionItem";
import style from "@/components/routes/Metadata/DistributionFormatsAccordion.module.scss";

const DistributionFormatsAccordion = ({ distributionFormatsGrouped, metadata }) => {
    if (!distributionFormatsGrouped?.length) return null;

    return (
        <Card data-color="neutral" className={style.accordionCard}>
            {distributionFormatsGrouped.map((item, index) => (
                <DistributionAccordionItem
                    key={`${index}-${item.ProtocolName ?? ""}`}
                    item={item}
                    metadata={metadata}
                />
            ))}
        </Card>
    );
};

DistributionFormatsAccordion.propTypes = {
    distributionFormatsGrouped: PropTypes.array,
    metadata: PropTypes.object,
};

export default DistributionFormatsAccordion;
