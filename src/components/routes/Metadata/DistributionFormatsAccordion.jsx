import React from "react";
import PropTypes from "prop-types";
import DistributionAccordionItem from "@/components/routes/Metadata/DistributionAccordionItem";
import style from "@/components/routes/Metadata/DistributionFormatsAccordion.module.scss";

const DistributionFormatsAccordion = ({ distributionFormatsGrouped, metadata }) => {
    if (!distributionFormatsGrouped?.length) return null;

    return (
        <div className={style.accordionList}>
            {distributionFormatsGrouped.map((item, index) => (
                <DistributionAccordionItem
                    key={`${index}-${item.ProtocolName ?? ""}`}
                    item={item}
                    metadata={metadata}
                />
            ))}
        </div>
    );
};

DistributionFormatsAccordion.propTypes = {
    distributionFormatsGrouped: PropTypes.array,
    metadata: PropTypes.object,
};

export default DistributionFormatsAccordion;
