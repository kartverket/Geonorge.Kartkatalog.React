import React from 'react';
import { Dialog } from '@digdir/designsystemet-react';
import CoverageMap from './CoverageMap';
import style from './CoverageMap.module.scss';

const CoverageMapModal = ({ open, onClose, layerGroups, center, zoom }) => {
  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} closedby="any" modal className={style.modalDialog}>
      <div className={style.modalContent}>
        <CoverageMap layerGroups={layerGroups} center={center} zoom={zoom} />
      </div>
    </Dialog>
  );
};

export default CoverageMapModal;
