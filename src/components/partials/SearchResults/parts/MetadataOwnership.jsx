import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { getResource } from "@/actions/ResourceActions";
import style from "@/components/partials/SearchResults/MetadataSearchResult.module.scss";
const restrictionsClassnames = (item) => {
        if (item.AccessConstraint === "restricted" || item.AccessIsProtected) {
            return style.red;
        }
        if (
            (item.AccessConstraint === "otherRestrictions" &&
                item.OtherConstraintsAccess === "norway digital restricted") ||
            item.AccessIsRestricted ||
            item.AccessConstraint === "norway digital restricted"
        ) {
            return style.yellow;
        } else {
            return style.green;
        }
    };

export const renderMetadataOwnership = (item, viewMode, dispatch) => {
        const openDataSymbolClass = restrictionsClassnames(item);
        let openDataSymbolTitle =
            item.IsOpenData || item.AccessIsOpendata
                ? "Åpne datasett"
                : "Krever innlogging";
            if (item.AccessConstraint && (item.AccessConstraint === "Personvern begrenset" || item.AccessConstraint === "Privacy restricted")
            || item.DataAccess &&(item.DataAccess === "Personvern begrenset" || item.DataAccess === "Privacy restricted")
            || item.DataAccess &&(item.DataAccess === "Skjermede data" || item.DataAccess === "Restricted data")
            ) {
                openDataSymbolTitle = "Kontakt dataeieren for tilgang";
            }
        const openDataSymbolIcon =
            item.IsOpenData || item.AccessIsOpendata
                ? ["fas", "lock-open"]
                : ["fas", "lock"];

        const listItemType = item.TypeTranslated || item.Type;
        const listItemOrganizations = item.Organizations;
        const listItemOrganization = item.Organization;

        // Handle array of organizations
        const viewParam = viewMode === "list" ? "&view=list" : "";
        const organizationLinks = listItemOrganizations && Array.isArray(listItemOrganizations)
            ? listItemOrganizations.map((org, index) => {
                const linkTitle = dispatch(
                    getResource("DisplayEverythingByVariable", "Vis alt fra {0}", [org])
                );

                return (
                    <span key={index}>
                        <Link title={linkTitle} to={"/?organizations=" + org + viewParam}>
                            {org}
                        </Link>
                        {index < listItemOrganizations.length - 1 ? ", " : ""}
                    </span>
                );
            })
            : null;

        // For single organization (fallback)
        const singleOrganization = listItemOrganization && !Array.isArray(listItemOrganization)
            ? listItemOrganization
            : null;

        const singleLinkTitle = singleOrganization ? dispatch(
            getResource("DisplayEverythingByVariable", "Vis alt fra {0}", [singleOrganization])
        ) : null;

        const singleLinkElement = singleOrganization ? (
            <Link title={singleLinkTitle} to={"/?organizations=" + singleOrganization + viewParam}>
                {singleOrganization}
            </Link>
        ) : null;

        const linkElement = organizationLinks || singleLinkElement;

        return (
            <span className={style.listItemInfo}>
                <FontAwesomeIcon
                    key="lock"
                    className={openDataSymbolClass}
                    title={openDataSymbolTitle}
                    icon={openDataSymbolIcon}
                />
                {dispatch(getResource("VariableBy", "{0} fra", [listItemType]))} {linkElement}
            </span>
        );
    };