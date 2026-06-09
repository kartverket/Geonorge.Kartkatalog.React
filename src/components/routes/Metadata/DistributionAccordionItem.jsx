import React, { useState, useCallback, useEffect } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { Details, Tag, Table, Button } from "@digdir/designsystemet-react";
import { CheckmarkCircleIcon, FilesIcon, CheckmarkIcon, ExternalLinkIcon } from "@navikt/aksel-icons";
import DownloadButton from "@/components/partials/Buttons/DownloadButton";
import buttonStyle from "@/components/partials/Buttons/Buttons.module.scss";
import "@digdir/designsystemet-css";
import style from "@/components/routes/Metadata/DistributionAccordionItem.module.scss";

const CopyUrlField = ({ url }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const timer = setTimeout(() => setCopied(false), 3000);
        return () => clearTimeout(timer);
    }, [copied]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(url).catch(() => {});
        setCopied(true);
    }, [url]);

    return (
        <div className={style.copyUrlField}>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={style.copyUrlLink}
            >
                {url}
            </a>
            <button className={style.copyUrlButton} onClick={handleCopy}>
                {copied ? <>Kopiert <CheckmarkCircleIcon title="Kopiert" fontSize="1.5rem" /></> : "Kopier lenke"}
            </button>
        </div>
    );
};

CopyUrlField.propTypes = { url: PropTypes.string.isRequired };

const CopyLinkHeaderButton = ({ url }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const timer = setTimeout(() => setCopied(false), 3000);
        return () => clearTimeout(timer);
    }, [copied]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(url).catch(() => {});
        setCopied(true);
    }, [url]);
    return (
        <Button variant="primary" className={buttonStyle.listButton} onClick={handleCopy}>
            {copied ? <CheckmarkIcon aria-hidden="true" fontSize="1.5rem" /> : <FilesIcon aria-hidden="true" fontSize="1.5rem" />}
            <span className={buttonStyle.buttonText}>{copied ? "Lenke kopiert" : "Kopier lenke"}</span>
        </Button>
    );
};

CopyLinkHeaderButton.propTypes = { url: PropTypes.string.isRequired };

const DistributionAccordionItem = ({ item, metadata }) => {
    const title = item.ProtocolName ?? "";
    const protocol = item.Protocol ?? "";
    const protocolDescription = item.ProtocolDescription ?? null;
    const formats = (item.Formats ?? []).map((f) => f.FormatName).filter(Boolean);
    const urls = item.URL ?? [];
    const unitsOfDistribution = item.UnitsOfDistribution ?? null;
    const referenceSystems = metadata?.ReferenceSystems ?? [];
    const dateUpdated = metadata?.DateUpdated && moment(metadata.DateUpdated).isValid()
        ? moment(metadata.DateUpdated).format("DD.MM.YYYY")
        : null;
    const maintenanceFrequency = metadata?.MaintenanceFrequency ?? null;
    const singleUrl = urls.length === 1;

    return (
        <div className={style.accordionWrapper}>
            <Details className={style.accordionItem}>
                <Details.Summary>
                    <div className={style.headerContent}>
                        <span className={style.title}>{title}</span>
                        {protocol === "GEONORGE:DOWNLOAD" && metadata && (
                            <div
                                className={style.actionButton}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <DownloadButton listButton={true} metadata={metadata} />
                            </div>
                        )}
                        {protocol === "W3C:REST" && urls.length > 0 && (
                            <div className={style.actionButton} onClick={(e) => e.stopPropagation()}>
                                <CopyLinkHeaderButton url={urls[0]} />
                            </div>
                        )}
                        {protocol === "WWW:LINK-1.0-http--link" && urls.length > 0 && (
                            <div className={style.actionButton} onClick={(e) => e.stopPropagation()}>
                                <Button asChild variant="primary" className={buttonStyle.listButton}>
                                    <a href={urls[0]} target="_blank" rel="noopener noreferrer">
                                        <ExternalLinkIcon aria-hidden="true" fontSize="1.5rem" />
                                        <span className={buttonStyle.buttonText}>Nettside</span>
                                    </a>
                                </Button>
                            </div>
                        )}
                    </div>
                </Details.Summary>
                <Details.Content>
                    {(protocolDescription || formats.length > 0 || urls.length > 0 || unitsOfDistribution || referenceSystems.length > 0 || dateUpdated) ? (
                        <Table className={style.detailsTable}>
                            <Table.Body>
                                {protocolDescription && (
                                    <Table.Row>
                                        <Table.Cell className={style.labelCell}>Beskrivelse</Table.Cell>
                                        <Table.Cell>{protocolDescription}</Table.Cell>
                                    </Table.Row>
                                )}
                                {formats.length > 0 && (
                                    <Table.Row>
                                        <Table.Cell className={style.labelCell}>Formater</Table.Cell>
                                        <Table.Cell>
                                            <div className={style.formats}>
                                                {formats.map((name, index) => (
                                                    <Tag key={index + "-" + name} data-size="sm">{name}</Tag>
                                                ))}
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                                {urls.length > 0 && (singleUrl ? (
                                    <Table.Row>
                                        <Table.Cell className={style.labelCell}>Tilgangs-URL</Table.Cell>
                                        <Table.Cell>
                                            <CopyUrlField url={urls[0]} />
                                        </Table.Cell>
                                    </Table.Row>
                                ) : (
                                    urls.map((url, index) => (
                                        <Table.Row key={index + "-" + url}>
                                            <Table.Cell className={`${style.labelCell} ${style.indentedLabelCell}`}>
                                                {formats[index] ?? ""}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <CopyUrlField url={url} />
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                ))}
                                {unitsOfDistribution && (
                                    <Table.Row>
                                        <Table.Cell className={style.labelCell}>Geografisk distribusjonsinndeling</Table.Cell>
                                        <Table.Cell>{unitsOfDistribution}</Table.Cell>
                                    </Table.Row>
                                )}
                                {referenceSystems.length > 0 && (
                                    <Table.Row>
                                        <Table.Cell className={style.labelCell}>Referansesystem</Table.Cell>
                                        <Table.Cell>
                                            <div className={style.formats}>
                                                {referenceSystems.map((rs, index) => (
                                                    <Tag key={index} data-size="sm" data-color="neutral">{rs.CoordinateSystem}</Tag>
                                                ))}
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                                {dateUpdated && (
                                    <Table.Row>
                                        <Table.Cell className={style.labelCell}>Datasett sist oppdatert</Table.Cell>
                                        <Table.Cell>{dateUpdated}</Table.Cell>
                                    </Table.Row>
                                )}
                                {maintenanceFrequency && (
                                    <Table.Row>
                                        <Table.Cell className={style.labelCell}>Oppdateringshyppighet</Table.Cell>
                                        <Table.Cell>{maintenanceFrequency}</Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    ) : null}
                </Details.Content>
            </Details>
        </div>
    );
};

DistributionAccordionItem.propTypes = {
    item: PropTypes.shape({
        ProtocolName: PropTypes.string,
        Protocol: PropTypes.string,
        ProtocolDescription: PropTypes.string,
        Organization: PropTypes.string,
        Formats: PropTypes.arrayOf(PropTypes.shape({ FormatName: PropTypes.string })),
        URL: PropTypes.arrayOf(PropTypes.string),
        UnitsOfDistribution: PropTypes.string,
    }).isRequired,
    metadata: PropTypes.object,
};

export default DistributionAccordionItem;
