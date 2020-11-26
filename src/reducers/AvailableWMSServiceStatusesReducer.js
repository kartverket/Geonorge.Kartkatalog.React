import {
    FETCH_AVAILABLE_WMS_SERVICE_STATUSES
} from 'actions/types';

const initialState = [
    {
    uuid: "0008ba93-e528-456d-9687-c405b3ad6da8",
    navn: "MarinGeokjemiWMS"
    },
    {
    uuid: "010c3fc4-3551-47aa-b10a-e01735bd1c0f",
    navn: "Sjø skyggerelieff grå WMS"
    },
    {
    uuid: "010c3fc4-3551-47aa-b10a-e01735bd1c0f",
    navn: "Sjø skyggerelieff grå WMS"
    },
    {
    uuid: "010e6d6b-5ba7-4d1c-9b2e-e5dc6133fc79",
    navn: "Artskart fremmede arter WMS"
    },
    {
    uuid: "01fbc6cb-0ccf-400d-a56d-77f39e75d5d7",
    navn: "INSPIRE Administrative units WMS"
    },
    {
    uuid: "02465a3a-e39e-41ca-bf7f-15ee5826692c",
    navn: "Dybde dekning WMS"
    },
    {
    uuid: "04917289-2e3e-4145-a87b-be270d2d83d4",
    navn: "naturtyper_naturbase WMS"
    },
    {
    uuid: "04c24266-ef07-4649-9865-85ab51108999",
    navn: "Mineraluttak WMS"
    },
    {
    uuid: "04dde63c-c690-432b-9d2e-ec6f1c9aa9f7",
    navn: "Reguleringsplaner WMS"
    },
    {
    uuid: "0511648f-1e55-46a9-92b3-10bcbcff3477",
    navn: "Høyde DTM helning grader WMS"
    },
    {
    uuid: "073b334a-5778-46b4-906d-d28427821ecd",
    navn: "NVE snø og klima WMS"
    },
    {
    uuid: "08e95748-13d0-4f05-8e4e-3794d765aa5c",
    navn: "Forvaltningsområder for rovdyr WMS"
    },
    {
    uuid: "0a193e8e-2e89-4c84-81c7-f2cf4333f718",
    navn: "Kulturlandskap - utvalgte WMS"
    },
    {
    uuid: "0ad7c206-7988-4687-9ff3-ce9c79d2d8e2",
    navn: "Svalbard Matrikkel WMS"
    },
    {
    uuid: "0af2aa07-abc1-4759-ab90-234b493bfe9a",
    navn: "Forvaltningsplanområder for havområdene"
    },
    {
    uuid: "0b18580c-6091-41e6-b6bd-f404288236f9",
    navn: "Dybderelieffpolar v02 WMS"
    },
    {
    uuid: "0c5bb880-bcbe-4297-841b-0a1680950d7b",
    navn: "NP Basiskart Svalbard WMS"
    },
    {
    uuid: "0cbd8848-834b-4774-bfe6-522863a0765e",
    navn: "Støysoner for Forsvarets skyte- og øvningsfelt WMS"
    },
    {
    uuid: "0e937264-abb0-4bcd-b690-73832640a44a",
    navn: "friluftsliv_kartlagt"
    },
    {
    uuid: "0fa5fa99-27ce-49fc-adb1-551b93b7b4d4",
    navn: "Matrikkelen Enkel WMS"
    },
    {
    uuid: "0fd3739d-c890-4004-b47b-992665f9e65a",
    navn: "Fylkesatlas Sogn og Fjordane - wms https"
    },
    {
    uuid: "109aa635-9ab4-4ab0-aff3-f18ac246d633",
    navn: "Nordatlas - WMS"
    },
    {
    uuid: "11f141f2-d91b-47e6-9b98-f5e7a6e7aa15",
    navn: "SR16 - Skogressurskart 16x16 meter - WMS"
    },
    {
    uuid: "11f141f2-d91b-47e6-9b98-f5e7a6e7aa15",
    navn: "SR16 - Skogressurskart 16x16 meter - WMS"
    },
    {
    uuid: "11f141f2-d91b-47e6-9b98-f5e7a6e7aa15",
    navn: "SR16 - Skogressurskart 16x16 meter - WMS"
    },
    {
    uuid: "11f141f2-d91b-47e6-9b98-f5e7a6e7aa15",
    navn: "SR16 - Skogressurskart 16x16 meter - WMS"
    },
    {
    uuid: "11f141f2-d91b-47e6-9b98-f5e7a6e7aa15",
    navn: "SR16 - Skogressurskart 16x16 meter - WMS"
    },
    {
    uuid: "11f141f2-d91b-47e6-9b98-f5e7a6e7aa15",
    navn: "SR16 - Skogressurskart 16x16 meter - WMS"
    },
    {
    uuid: "11f141f2-d91b-47e6-9b98-f5e7a6e7aa15",
    navn: "SR16 - Skogressurskart 16x16 meter - WMS"
    },
    {
    uuid: "12d9e00f-0232-489f-9810-3bccf54914ed",
    navn: "Høyde DTM 50 meter WMS"
    },
    {
    uuid: "1322f05d-8e77-49cb-a59b-ecc8c7f7de79",
    navn: "Reguleringsplanforslag WMS"
    },
    {
    uuid: "1472a1a3-524b-49d9-8a10-7dd6183e510b",
    navn: "Havvind WMS"
    },
    {
    uuid: "1472a1a3-524b-49d9-8a10-7dd6183e510b",
    navn: "Havvind WMS"
    },
    {
    uuid: "14db463f-50cc-4531-8c00-8d48a9f00643",
    navn: "Statlige planretningslinjer for differensiert forvaltning av strandsonen langs sjøen WMS"
    },
    {
    uuid: "14e47ca3-e4c7-429d-aa05-c01265a656c4",
    navn: "Miljøverdi, hav WMS"
    },
    {
    uuid: "14fc5112-8c2f-481d-a03e-f88b3fe0bd24",
    navn: "Verdifulle kulturlandskap WMS"
    },
    {
    uuid: "15726b49-a586-46d7-98b0-35c71f9451fa",
    navn: "Europakart WMS"
    },
    {
    uuid: "18fa1fa7-a1de-4d9f-b484-6560844bd788",
    navn: "Satelittdata - Sentinel-2 - Skyfri mosaikk 2018 WMS"
    },
    {
    uuid: "19f5d1b3-1007-48e5-b762-183ce51b457b",
    navn: "Landskap - WMS"
    },
    {
    uuid: "1af1a34f-af1a-463e-a1bf-c3bcd1347c5e",
    navn: "Snø og steinskred - Aktsomhetsområder WMS"
    },
    {
    uuid: "1c50a56a-4f02-4844-9d52-3a14cb3b61bb",
    navn: "Høyde DTM helning prosent WMS"
    },
    {
    uuid: "1cc08775-f3c0-4fc9-82d1-90aa7e51b81c",
    navn: "Utvalgte naturtyper WMS"
    },
    {
    uuid: "1dcb696c-90cc-4b36-9bce-0269bfd993d0",
    navn: "Arealressurskart - FKB-AR5 - Forvaltning - WMS"
    },
    {
    uuid: "20497e23-38f5-442b-b001-bdf181b1028e",
    navn: "Jordsmonn - WMS"
    },
    {
    uuid: "20a46f17-29e7-44a6-992c-1215feb54a84",
    navn: "Temakart Rogaland"
    },
    {
    uuid: "21768df3-ad90-4aca-8d5b-06ad563b304c",
    navn: "Matrikkelen Enkel WMS graatone"
    },
    {
    uuid: "21be7540-adba-42d9-9f3c-583365491eea",
    navn: "DSBs WMS-tjenester"
    },
    {
    uuid: "25549b7e-53e2-4493-bb9f-2a708fd5d9bb",
    navn: "GEBCO skyggerelief WMS"
    },
    {
    uuid: "25554d65-3471-4bb1-8903-7495f3aeabbb",
    navn: "MarinBunnsedimenterWMS"
    },
    {
    uuid: "269ed5de-d561-4420-a996-61d294da93df",
    navn: "Nedbørfelt WMS"
    },
    {
    uuid: "270f936d-ebed-42b0-a127-545383d773fc",
    navn: "BarentsWatch WMS"
    },
    {
    uuid: "2936eac3-8ab1-413f-82dd-5ef19d6b5566",
    navn: "Artsutbredelse Fisk (WMS/WFS)"
    },
    {
    uuid: "294f3987-1cda-426e-baf9-a086a09b3e4d",
    navn: "Stormflo WMS"
    },
    {
    uuid: "294f3987-1cda-426e-baf9-a086a09b3e4d",
    navn: "Stormflo WMS"
    },
    {
    uuid: "2b3d2911-ab9a-467d-8636-fde7adf3cb84",
    navn: "Høyde DTM multiskyggerelieff WMS"
    },
    {
    uuid: "2b767304-5beb-47b3-85b0-0e25c086937d",
    navn: "Skyteanlegg DFS WMS"
    },
    {
    uuid: "2bad294a-c21b-4244-8ac8-b8fca95521e4",
    navn: "IndustrimineralerWMS2"
    },
    {
    uuid: "2dcecff9-70b6-4f14-b934-af377bff88d9",
    navn: "Vannkraft WMS"
    },
    {
    uuid: "2e106fc9-3386-4011-9718-77ab522eadbc",
    navn: "Reguleringsplan - Kragerø WMS"
    },
    {
    uuid: "3089e311-e933-47f7-bc62-ba42e58fa739",
    navn: "Sjøkart - raster 2 WMS"
    },
    {
    uuid: "30dda4c6-2cba-4378-b2e7-26f644df9d99",
    navn: "Matrikkelkart WMS"
    },
    {
    uuid: "31e7887a-5c45-4086-a9e9-203412ca72c4",
    navn: "Biogeografiske regioner WMS"
    },
    {
    uuid: "31ff5717-f9dd-4279-a456-b079b4735b3e",
    navn: "Høyde DTM lokal høyde WMS"
    },
    {
    uuid: "326a3cd6-6062-456c-bed7-da83b80318d0",
    navn: "Forsvarets skyte- og øvingsfelt i sjø WMS"
    },
    {
    uuid: "3389a1c5-3093-44a0-9d2b-1e6c1b4f8944",
    navn: "INSPIRE Elevation WMS"
    },
    {
    uuid: "372ee653-4453-404e-83d1-c3be7b87478c",
    navn: "Corine Landcover (CLC) Norway - WMS"
    },
    {
    uuid: "37de5d31-41ec-453a-8a33-8734383d9411",
    navn: "WMS - alle datasett fra Statistisk Sentralbyrå"
    },
    {
    uuid: "38ff8b95-2af9-4a56-967a-839a933c9ee4",
    navn: "Gårdskart WMS"
    },
    {
    uuid: "39182376-1628-408a-8d25-dd180b08d847",
    navn: "Sjø skyggerelieff WMS"
    },
    {
    uuid: "3a3eda68-f6ae-4a44-a934-c91a1e8fb562",
    navn: "BerggrunnWMS"
    },
    {
    uuid: "3b6d11f2-065d-46eb-bd7c-0febfa03a0b4",
    navn: "Arealressurskart - AR250 - WMS"
    },
    {
    uuid: "3ed89924-76a8-48bf-998f-544fded315df",
    navn: "Høyde DTM prosjekter WMS"
    },
    {
    uuid: "3ef882e4-fb2b-4a6f-a60b-5c15ac1ba626",
    navn: "Høyde DTM prosjekter punkttetthet WMS"
    },
    {
    uuid: "3f59e82c-217b-4092-a1dc-6327a9c3bfbf",
    navn: "Rapporter etter undersøkelser på statens mineraler WMS"
    },
    {
    uuid: "3ff252c6-42ba-4151-a458-7e4c63a15591",
    navn: "WMS- Kartdata- Notodden"
    },
    {
    uuid: "3ffa635f-7ae1-462a-9fbb-0888eb99b8ad",
    navn: "Særlig verdifulle og sårbare områder"
    },
    {
    uuid: "400c37fa-36c2-4d34-aac6-c99720d9bee5",
    navn: "Byggeforbudssoner kraftledninger WMS"
    },
    {
    uuid: "430b65ec-8543-4387-bf45-dbb5ce4bf4c8",
    navn: "Toporaster 4 WMS"
    },
    {
    uuid: "45efd0fd-a4f9-42c0-aed4-2937ac7c6d8d",
    navn: "Høyde DOM 1 meter WMS"
    },
    {
    uuid: "46515853-2672-42a3-b665-7a82c6174629",
    navn: "Vannforekomster WMS"
    },
    {
    uuid: "4766ee62-614f-48dc-a16e-d1d3de21b998",
    navn: "Tredata - WMS"
    },
    {
    uuid: "4766ee62-614f-48dc-a16e-d1d3de21b998",
    navn: "Tredata - WMS"
    },
    {
    uuid: "491a172b-4958-4b6a-8f04-fd19ee5f0959",
    navn: "Skredhendelser WMS"
    },
    {
    uuid: "49345493-0682-4a9e-8b08-36ac0506f51d",
    navn: "Dybde DTM WMS"
    },
    {
    uuid: "4a0f9676-7cd0-4555-a8f3-763bb769d5d4",
    navn: "GranadaWMS3"
    },
    {
    uuid: "4b3d44cd-a866-4bb7-a053-e60181da3901",
    navn: "Kulturminner - SEFRAK-bygninger WMS"
    },
    {
    uuid: "4bbae38e-4718-481d-9827-237cd5e115c8",
    navn: "Støy Veg WMS"
    },
    {
    uuid: "4d07b725-40c1-455a-a3b3-7398bb4022d1",
    navn: "Høyde DTM 1 meter WMS"
    },
    {
    uuid: "4d0fd462-aa69-4d49-b773-52382dc0e450",
    navn: "Markagrensen WMS"
    },
    {
    uuid: "4e030688-94c6-4fce-841e-42a8dda3701c",
    navn: "Snøskred - Aktsomhetsområder WMS"
    },
    {
    uuid: "4e8870ba-9ce8-4bd6-80d6-49c723953427",
    navn: "Jordsmonn - Potensial for grønnsaksdyrking - WMS"
    },
    {
    uuid: "50263c33-74bc-4ea8-b44e-a0c470e57904",
    navn: "Administrative områder vanndirektivet WMS"
    },
    {
    uuid: "50c31e8a-bd23-4983-ad34-8077f8b267f5",
    navn: "Kulturminner i Skedsmo kommune - lokale data WMS"
    },
    {
    uuid: "50e2d9e4-ef41-4152-8499-94819beecbae",
    navn: "NPD FactMaps 3.0 WMS ED50"
    },
    {
    uuid: "52a55a3c-bcd2-44d7-ac21-2f4550161937",
    navn: "Geologisk naturarv"
    },
    {
    uuid: "551ebd8b-d5e8-4304-a030-505b03dd8773",
    navn: "Skredfaresoner WMS"
    },
    {
    uuid: "5569f537-5f60-46a1-a501-ef2459269e4c",
    navn: "O-kartregisteret aktuelle kart WMS"
    },
    {
    uuid: "560eab89-41a7-49a1-97f3-690d9745f1a7",
    navn: "Planregisterstatus WMS"
    },
    {
    uuid: "56472714-57dd-47bc-a343-18dfdf2d974c",
    navn: "Høyde DTM lokal høyde sømløs WMS"
    },
    {
    uuid: "56472714-57dd-47bc-a343-18dfdf2d974c",
    navn: "Høyde DTM lokal høyde sømløs WMS"
    },
    {
    uuid: "56d76f1c-0bee-4775-b2f4-4af06322449c",
    navn: "INSPIRE Buildings WMS"
    },
    {
    uuid: "57bcf66a-1333-498f-a1f1-13f27a9cee1f",
    navn: "Fjellskygge WMS"
    },
    {
    uuid: "57cea287-74ef-4809-bc2f-fe441eefb925",
    navn: "Kommuneplanforslag WMS"
    },
    {
    uuid: "59553777-fc47-4103-bc0d-d2e6a63611be",
    navn: "Høyde DTM helning grader sømløs WMS"
    },
    {
    uuid: "59553777-fc47-4103-bc0d-d2e6a63611be",
    navn: "Høyde DTM helning grader sømløs WMS"
    },
    {
    uuid: "5c171f4b-48d8-49eb-bc63-5e6ea26f4cc1",
    navn: "Kommuneplan Elverum, Våler, Åsnes og Grue kommune (wms)"
    },
    {
    uuid: "5d1dfef6-048f-4164-af22-221c4b510b7c",
    navn: "Høyde DTM lokal høyde farge WMS"
    },
    {
    uuid: "5eb2d447-752b-49f3-9acb-28d9461b2564",
    navn: "Tur- og friluftsruter WMS"
    },
    {
    uuid: "5f219fd8-abee-4947-9983-8a764ac89fab",
    navn: "Marine grunnkart WMS"
    },
    {
    uuid: "6023d55e-f0c2-4e70-b207-441bb8ddbfd1",
    navn: "Artskart rødlistearter WMS"
    },
    {
    uuid: "6050aef8-b51a-43fe-a340-e2772fc182fb",
    navn: "Høyde DTM multiskyggerelieff sømløs WMS"
    },
    {
    uuid: "6050aef8-b51a-43fe-a340-e2772fc182fb",
    navn: "Høyde DTM multiskyggerelieff sømløs WMS"
    },
    {
    uuid: "6054b750-cf39-4de3-bc65-fb75e4a0c40a",
    navn: "Marin verneplan"
    },
    {
    uuid: "633f7795-3e71-4581-b710-cb359ff108cb",
    navn: "Bakgrunnskart for Matrikkelen WMS"
    },
    {
    uuid: "633f7795-3e71-4581-b710-cb359ff108cb",
    navn: "Bakgrunnskart for Matrikkelen WMS"
    },
    {
    uuid: "63a527e9-1510-4df8-b7d8-ead5b4dc2785",
    navn: "Badeplasser - WMS"
    },
    {
    uuid: "63a527e9-1510-4df8-b7d8-ead5b4dc2785",
    navn: "Badeplasser - WMS"
    },
    {
    uuid: "63c672fa-e180-4601-a176-6bf163e0929d",
    navn: "Matrikkelen WMS"
    },
    {
    uuid: "640297dc-0fbf-49c1-9266-1f82ac545260",
    navn: "Kartdata3 WMS"
    },
    {
    uuid: "643707e7-9cb0-4fd8-8ed2-f6b5f2cef018",
    navn: "GrusPukkWMS5"
    },
    {
    uuid: "658e776a-bdbf-4916-9760-d60b1b342fea",
    navn: "kostholdsrad (WMS)"
    },
    {
    uuid: "65dbccc9-3586-4597-8956-061059b7fa37",
    navn: "Truede arter - hot spots WMS"
    },
    {
    uuid: "660fe58a-11ff-47df-b6a1-bec9593404ec",
    navn: "wms svekket is"
    },
    {
    uuid: "666e4559-60bf-4a1d-9e72-c43502a9a58b",
    navn: "Administrative enheter WMS"
    },
    {
    uuid: "69dfb64f-dbdf-4c4a-96d3-64ee3325c319",
    navn: "Topografisk webbkarta"
    },
    {
    uuid: "6a4a485a-1dc4-4d20-8d9a-53271797168a",
    navn: "Vegetasjon - WMS"
    },
    {
    uuid: "6b58021d-9c91-425a-9c67-7e424f007c1b",
    navn: "Vernskog - WMS"
    },
    {
    uuid: "6b6f887d-ecc7-44ca-b9bc-7172392d2993",
    navn: "DTM, DOM over Trondheim kommune"
    },
    {
    uuid: "6bf84018-1724-4ba9-9c25-879b5d204a19",
    navn: "NP Basiskart Jan Mayen WMS"
    },
    {
    uuid: "6c86baac-c80a-46de-a087-8a32d7c5c8cd",
    navn: "Snøscooterløyper WMS"
    },
    {
    uuid: "6cbea7c0-885f-41c9-a931-3551fd140b01",
    navn: "Kulturminner - Brannvern WMS"
    },
    {
    uuid: "6d24e783-0af1-47d3-a413-f3309fa186d5",
    navn: "NatursteinWMS2"
    },
    {
    uuid: "6e4dc6be-c338-49e1-a5c7-dddaff8d607b",
    navn: "Kirkebygg - forenklet WMS"
    },
    {
    uuid: "6e755acc-9d80-4715-95ce-5aff34aac8c3",
    navn: "INSPIRE Hydrography WMS"
    },
    {
    uuid: "6fea713e-0d47-49b2-b71b-cb679d7e6b89",
    navn: "avlop (WMS)"
    },
    {
    uuid: "705ef837-09a6-4d89-b451-76ceafdedd19",
    navn: "Norge i bilder WMS-Mosaikk"
    },
    {
    uuid: "71a67b3b-4c42-4759-bf39-d8a1f00c542b",
    navn: "Hallingkart wms"
    },
    {
    uuid: "725712bc-2084-45df-b85e-2f64bd80ed1b",
    navn: "Inspire Sea regions WMS"
    },
    {
    uuid: "726b28c4-d601-4909-892f-f54b3a00a6ad",
    navn: "Jernbane - Banenettverk WMS"
    },
    {
    uuid: "748e7d8b-c2eb-4901-9eec-98cfc59ebcff",
    navn: "Seismic area (wms)"
    },
    {
    uuid: "74de64a7-14b2-4582-984b-631ee4dcfc9f",
    navn: "artnasjonal WMS"
    },
    {
    uuid: "75f6b36d-44a5-42c1-a634-0ae725726bbb",
    navn: "WMS- Kartdata- Midt- Telemark"
    },
    {
    uuid: "768a3ca6-0655-45d5-8cd5-76bd7e0e59d2",
    navn: "Kystverkets WMS"
    },
    {
    uuid: "77749f6a-7eb3-4ac3-9f51-0d511d7abf62",
    navn: "Steinsprang - Atksomhetsområder WMS"
    },
    {
    uuid: "77785340-1208-4fe8-9afd-00b83c6f5e93",
    navn: "Norge i bilder WMS-Prosjekt"
    },
    {
    uuid: "7790f618-eb6a-4c4a-a925-8a605565ae92",
    navn: "Dybdekurver WMS"
    },
    {
    uuid: "79ea9761-1ac9-4780-a065-e4738835643e",
    navn: "N5Raster2 WMS"
    },
    {
    uuid: "79fe1ffa-6615-4507-b3ad-04a97e720d94",
    navn: "MarinSannsynligeKorallrevWMS"
    },
    {
    uuid: "7b02437b-f664-41b9-bed7-de058c2d199f",
    navn: "Vær, hav og bølgekart"
    },
    {
    uuid: "7b8ce243-077e-4c69-92f4-72737abec602",
    navn: "Geologi S750"
    },
    {
    uuid: "7c0198f4-b579-45c7-b4e2-a5d6350318af",
    navn: "Fjordkatalogen WMS"
    },
    {
    uuid: "7c3471c5-2f58-4759-b094-6a3197fbb833",
    navn: "Høyde DOM skyggerelieff WMS"
    },
    {
    uuid: "7d28d80c-b4f7-4256-bea8-30c851426f8d",
    navn: "Høyde DTM 10 meter (UTM32) WMS"
    },
    {
    uuid: "7d28d80c-b4f7-4256-bea8-30c851426f8d",
    navn: "Høyde DTM 10 meter (UTM32) WMS"
    },
    {
    uuid: "7d28d80c-b4f7-4256-bea8-30c851426f8d",
    navn: "Høyde DTM 10 meter (UTM32) WMS"
    },
    {
    uuid: "7d28d80c-b4f7-4256-bea8-30c851426f8d",
    navn: "Høyde DTM 10 meter (UTM32) WMS"
    },
    {
    uuid: "7dc3bb2a-8929-49d5-a465-9af965fb556a",
    navn: "Støysoner lufthavn WMS"
    },
    {
    uuid: "7e6307a0-1a7d-4470-a722-a4368faf31e6",
    navn: "Arealressurskart - FKB-AR5 - Forvaltning - 2 - WMS"
    },
    {
    uuid: "7e9b788f-06e8-4636-8e73-f7a80b0fb693",
    navn: "Inngrepsfri natur WMS"
    },
    {
    uuid: "7efdba97-758e-463d-bd00-bdc9b13d272f",
    navn: "Ramsar"
    },
    {
    uuid: "801a3713-b6fa-449b-a2b5-eda403f74abf",
    navn: "Sårbare bygninger"
    },
    {
    uuid: "8045628b-230a-4ba4-a6e0-7f368731447f",
    navn: "Høyde DOM 1 (UTM32) WMS"
    },
    {
    uuid: "80b7eab8-d5da-4136-8ec6-2002867a2b2b",
    navn: "Navigasjonsinstallasjoner WMS"
    },
    {
    uuid: "8214dda0-8a22-41f6-8ba1-76a778ad86ff",
    navn: "Sikringstiltak i vassdrag WMS"
    },
    {
    uuid: "834179b8-d189-4bc0-b00f-533ffe80faed",
    navn: "Flom aktsomhetsområder WMS"
    },
    {
    uuid: "836a3c18-81fb-4bf7-9f12-36300c70d9db",
    navn: "WMS for Levanger og Verdal kommuner"
    },
    {
    uuid: "83aa05eb-aa2f-42e0-8775-daa474883120",
    navn: "MarinNaturtyperWMS2"
    },
    {
    uuid: "83d8b91d-1491-4aec-b4c8-a9450a86b95d",
    navn: "INSPIRE Transport Network Road WMS"
    },
    {
    uuid: "8406c157-70cc-40bc-999d-87ebdb94dcdb",
    navn: "INSPIRE - Protected Sites WMS"
    },
    {
    uuid: "88d06ff8-d5a0-43f4-b254-051e3956aec8",
    navn: "Natur i verneområder (NiN)"
    },
    {
    uuid: "892d016e-6cc7-48e1-b82f-7bd82ebbeabb",
    navn: "Høyde DTM skyggerelieff WMS"
    },
    {
    uuid: "89ff6590-b3fa-4184-9b37-e058db55cfda",
    navn: "SFKB Transaksjoner WMS-T"
    },
    {
    uuid: "8b7213fb-2c4c-450b-831b-f7eb5c3a1151",
    navn: "Reguleringsplan - Arendal Kommune"
    },
    {
    uuid: "8bcea090-8cf0-4ff8-bbd2-4d5a9a596845",
    navn: "Dyrkingspotensial gras og korn"
    },
    {
    uuid: "8c233f06-2327-46ed-b330-c57c86e70d79",
    navn: "Terrengmodell WMS"
    },
    {
    uuid: "8c2c434b-07f7-4ebc-9bc6-9c15cdd75c4c",
    navn: "Fastmerker & Basestajoner WMS"
    },
    {
    uuid: "8cebdd23-bbbc-44d3-bdd0-56af1ba0b689",
    navn: "Høyde DTM skyggerelieff sømløs WMS"
    },
    {
    uuid: "8cebdd23-bbbc-44d3-bdd0-56af1ba0b689",
    navn: "Høyde DTM skyggerelieff sømløs WMS"
    },
    {
    uuid: "8cebdd23-bbbc-44d3-bdd0-56af1ba0b689",
    navn: "Høyde DTM skyggerelieff sømløs WMS"
    },
    {
    uuid: "8cebdd23-bbbc-44d3-bdd0-56af1ba0b689",
    navn: "Høyde DTM skyggerelieff sømløs WMS"
    },
    {
    uuid: "8ecaa2d5-8b0a-46cf-a2a7-2584f78b12e2",
    navn: "Norges grunnkart WMS"
    },
    {
    uuid: "8f191dcd-bcec-4044-8259-a2a1b43cfb85",
    navn: "Arealressurskart - AR50 - WMS"
    },
    {
    uuid: "8f789e8c-97fe-4b12-a10a-73858a0fd475",
    navn: "Kystkart"
    },
    {
    uuid: "92e8f0ec-b627-41aa-ab66-0217657554ed",
    navn: "GEBCO WMS"
    },
    {
    uuid: "92e8f0ec-b627-41aa-ab66-0217657554ed",
    navn: "GEBCO WMS"
    },
    {
    uuid: "933b1121-9826-4c41-95ac-ecbe7da0b114",
    navn: "Høyde DTM helning prosent sømløs WMS"
    },
    {
    uuid: "933b1121-9826-4c41-95ac-ecbe7da0b114",
    navn: "Høyde DTM helning prosent sømløs WMS"
    },
    {
    uuid: "933b1121-9826-4c41-95ac-ecbe7da0b114",
    navn: "Høyde DTM helning prosent sømløs WMS"
    },
    {
    uuid: "933b1121-9826-4c41-95ac-ecbe7da0b114",
    navn: "Høyde DTM helning prosent sømløs WMS"
    },
    {
    uuid: "948b4251-f84b-4073-8aa1-92ca3be2005b",
    navn: "Kartbladinndelinger wms"
    },
    {
    uuid: "9640ffdd-6343-40f9-9130-95a93388d6cb",
    navn: "INSPIRE Land Cover WMS"
    },
    {
    uuid: "973ef399-1d8f-42c1-895c-4f6f77ff1a8c",
    navn: "Kartdata3 gråtone WMS"
    },
    {
    uuid: "973ef399-1d8f-42c1-895c-4f6f77ff1a8c",
    navn: "Kartdata3 gråtone WMS"
    },
    {
    uuid: "973ef399-1d8f-42c1-895c-4f6f77ff1a8c",
    navn: "Kartdata3 gråtone WMS"
    },
    {
    uuid: "973ef399-1d8f-42c1-895c-4f6f77ff1a8c",
    navn: "Kartdata3 gråtone WMS"
    },
    {
    uuid: "98dd016f-b905-463b-a633-6be2a33fcec2",
    navn: "vannmiljo (WMS)"
    },
    {
    uuid: "98eda42b-c771-46fa-b1ea-bd875840fe60",
    navn: "Helling - WMS"
    },
    {
    uuid: "9960bcf1-de21-46c5-a4d8-ec4e1dddc362",
    navn: "Vindkraftverk WMS"
    },
    {
    uuid: "99aeed7a-c41d-4e5f-bfe9-8378d336ad91",
    navn: "Kommuneplan WMS, Modum"
    },
    {
    uuid: "9a0ad485-383f-4903-9212-c425d6e24544",
    navn: "SEAPOP Estimerte hekkebestander for sjøfugl WMS"
    },
    {
    uuid: "9a9d1682-1dc6-489e-b37c-7b054449169a",
    navn: "Forurenset grunn i Skedsmo kommune - WMS"
    },
    {
    uuid: "9ae66d3b-8ea0-4e0c-8e25-01511a98e683",
    navn: "Skogbruksplan - Miljøregistreringer i skog - MiS-figurer - WMS"
    },
    {
    uuid: "9c2bda8c-2af0-4458-90ad-5686d9e2d777",
    navn: "FKB4 WMS"
    },
    {
    uuid: "9c2d96ec-b701-4532-a075-d4fcfddfe8d7",
    navn: "Dyrkbar jord - WMS"
    },
    {
    uuid: "9cda479e-ed0d-44a3-8d90-8fe519c148c7",
    navn: "Prioriteringskart WMS"
    },
    {
    uuid: "9d45d424-04b6-4118-a8c1-6ad0a11f3ddd",
    navn: "Berggrunn WMS2"
    },
    {
    uuid: "9d8026d6-c08c-4c7d-afe8-d2983771840c",
    navn: "Bergrettigheter WMS"
    },
    {
    uuid: "9e7e5007-4271-4306-ab83-bfea14f19789",
    navn: "Fiske- og krepsevann - WMS"
    },
    {
    uuid: "9e7e5007-4271-4306-ab83-bfea14f19789",
    navn: "Fiske- og krepsevann - WMS"
    },
    {
    uuid: "9eff176f-5707-4756-80d2-ffbdd44e11cd",
    navn: "Høyde DOM prosjekter WMS"
    },
    {
    uuid: "9f51ffea-549b-48a7-9d6e-19cf7c84cc40",
    navn: "Grunnforurensning 2 WMS"
    },
    {
    uuid: "a1ba53a1-fec5-427a-a436-097ef90a278b",
    navn: "Høyde DOM 10 meter WMS"
    },
    {
    uuid: "a236c695-cf01-430c-a23d-42ed36dc4e33",
    navn: "Beitebruk - WMS"
    },
    {
    uuid: "a7cbda94-e62e-471e-8f47-cca1c6228535",
    navn: "Innsjødatabase WMS"
    },
    {
    uuid: "a8e00c04-b8a0-42f1-b75f-bf98c111f2ae",
    navn: "WMS- Kartdata- Tinn"
    },
    {
    uuid: "a90500c2-8d27-48ad-a44e-de9e3cf1178c",
    navn: "Arktiske administrative enheter WMS"
    },
    {
    uuid: "aa780848-5de8-4562-8f35-3d5c80ea8b48",
    navn: "Løsmasser WMS"
    },
    {
    uuid: "aac7c7d9-5101-49f2-870e-6e88c9633a38",
    navn: "Jord- og flomskred aktsomhetsområder WMS"
    },
    {
    uuid: "ab5a16be-70ff-499f-95d3-28576cf5bb03",
    navn: "SEAPOP Bestander for sjøfugl i åpent hav WMS"
    },
    {
    uuid: "ac6273ff-e4a8-48c8-90bc-eb401b275cf7",
    navn: "Sjøkart - elektroniske WMS"
    },
    {
    uuid: "ac71516e-6628-4753-9496-608466f322b6",
    navn: "WMS- Kartdata- 12K"
    },
    {
    uuid: "ac9533a0-03e7-4127-8e96-109a20ab6b9c",
    navn: "Nettanlegg WMS"
    },
    {
    uuid: "ad1a7d9f-0c48-40ae-add2-6239f98adc78",
    navn: "DOK fullstendighetdekningskart WMS"
    },
    {
    uuid: "add79a77-0dbb-4720-a33a-52bc0e3df1db",
    navn: "Arealbruk WMS"
    },
    {
    uuid: "add79a77-0dbb-4720-a33a-52bc0e3df1db",
    navn: "Arealbruk WMS"
    },
    {
    uuid: "af0f6a79-846c-4b24-bfd6-2d06dc103f71",
    navn: "MarinLandskapWMS"
    },
    {
    uuid: "af3409eb-fd28-4480-8da0-0292aaad723e",
    navn: "UTM-rutenett WMS"
    },
    {
    uuid: "af6bb75c-b10b-4ef4-8fed-1ea01b6d37c6",
    navn: "Digitalt Markslagskart (DMK) - WMS - Historisk datasett"
    },
    {
    uuid: "b139a2c3-bdc3-4420-9def-4ce1080fcf0c",
    navn: "Tilgjengelighets WMS"
    },
    {
    uuid: "b1966b1e-8920-4405-bf0e-b8e7394ec8d5",
    navn: "Arealressurskart - FKB-AR5 - WMS"
    },
    {
    uuid: "b35ec9f6-5eca-42ab-a8bd-bf56703ff4ea",
    navn: "SAT-SKOG - WMS"
    },
    {
    uuid: "b41a996d-ccac-464a-a8f5-107008388638",
    navn: "Riksgrense Norge-Russland fra 1947-1984"
    },
    {
    uuid: "b5df937a-9d25-4c4b-848c-f29c6ddac8a6",
    navn: "Dybdedata - dekning sjømåling WMS versjon 2"
    },
    {
    uuid: "b5df937a-9d25-4c4b-848c-f29c6ddac8a6",
    navn: "Dybdedata - dekning sjømåling WMS versjon 2"
    },
    {
    uuid: "b97109c6-d16e-4a1b-b555-51167f8be9bb",
    navn: "Høyde prosjekter WMS"
    },
    {
    uuid: "b9c31c0a-b2b4-4c35-b94c-0db14bab5fec",
    navn: "O-kartregisteret WMS"
    },
    {
    uuid: "ba518936-f9b3-4363-b5c6-9118acb1d88c",
    navn: "Støysoner for Bane NORs jernbanenett WMS"
    },
    {
    uuid: "bd94b863-4222-43a4-9ae4-9d947cde2dcf",
    navn: "SR16-beta"
    },
    {
    uuid: "bddba6c6-0629-4d1f-b98c-5492bf637c9c",
    navn: "Kulturminner - Askeladden WMS"
    },
    {
    uuid: "c09665da-f82b-4414-b2c2-daf5a54957d3",
    navn: "Kommuneplaner WMS"
    },
    {
    uuid: "c431a4c5-22fd-4f37-9040-5c38e3a8402e",
    navn: "Villrein WMS"
    },
    {
    uuid: "c49ef735-b0ab-49be-a1ba-5654fe8e5c27",
    navn: "Vær og klima; Lufttemperatur (0-66 timer)"
    },
    {
    uuid: "c4a34358-dab5-4398-a195-52e20652d44f",
    navn: "industri (WMS)"
    },
    {
    uuid: "c60f16ad-7519-4b2f-9cae-2f61d1d1b413",
    navn: "Laksekart WMS"
    },
    {
    uuid: "c61837f5-eb84-4864-b2cb-31422620286a",
    navn: "Markfuktighet - WMS"
    },
    {
    uuid: "c6eb0874-092a-4934-8ecb-d51da4c6f805",
    navn: "Stedsnavn WMS"
    },
    {
    uuid: "c7268952-52ea-45fd-8dce-16e7b4e29d8d",
    navn: "MarinGrenseWMS3"
    },
    {
    uuid: "c73bf950-ca32-44f0-af93-6689d468ca48",
    navn: "petroleumsvirksomhet"
    },
    {
    uuid: "c86c9db6-90d5-4b23-9b15-673050b35d33",
    navn: "Høyde DTM 1 meter (UTM32) WMS"
    },
    {
    uuid: "c86c9db6-90d5-4b23-9b15-673050b35d33",
    navn: "Høyde DTM 1 meter (UTM32) WMS"
    },
    {
    uuid: "c8a60dae-c914-4b67-95b8-f96c0e82a73d",
    navn: "Høyde DTM lokalhøyde farge sømløs WMS"
    },
    {
    uuid: "c8a60dae-c914-4b67-95b8-f96c0e82a73d",
    navn: "Høyde DTM lokalhøyde farge sømløs WMS"
    },
    {
    uuid: "c8b17673-e919-4800-8b3a-75d9152df890",
    navn: "Høyde DTM 10 meter WMS"
    },
    {
    uuid: "ca357671-e26b-4fea-831a-082ef2b1e18f",
    navn: "Radioaktivitet i marint miljø WMS"
    },
    {
    uuid: "cbb8b9d7-4012-4b28-be8b-246af3b5478f",
    navn: "Forsvarets skyte- og øvingsfelt WMS"
    },
    {
    uuid: "ccf1677e-e20c-44df-88f5-3d1b0a1f3748",
    navn: "Rammer for petroleumsaktivitet"
    },
    {
    uuid: "cd489214-9813-40c4-b2be-b51d9cd9a22a",
    navn: "Arealressurskart - FKB-AR5 - Oppdateringsbehov - WMS"
    },
    {
    uuid: "cf630753-508a-4e7a-99da-ae1111090248",
    navn: "Mattilsynets WMS"
    },
    {
    uuid: "cfbac836-7892-4b30-a49e-7b555e503656",
    navn: "Kartdata NIB"
    },
    {
    uuid: "cfbac836-7892-4b30-a49e-7b555e503656",
    navn: "Kartdata NIB"
    },
    {
    uuid: "d20ed245-2ad5-4a3f-a39c-28dcd5549c41",
    navn: "MetallerWMS"
    },
    {
    uuid: "d24a0bf9-1398-4bc4-a4ba-63896b0a599c",
    navn: "Norges grunnkart graatone WMS"
    },
    {
    uuid: "d24a0bf9-1398-4bc4-a4ba-63896b0a599c",
    navn: "Norges grunnkart graatone WMS"
    },
    {
    uuid: "d24a0bf9-1398-4bc4-a4ba-63896b0a599c",
    navn: "Norges grunnkart graatone WMS"
    },
    {
    uuid: "d3a8d00c-e305-4b41-8630-0853ea198b69",
    navn: "Berggrunn N50 WMS2"
    },
    {
    uuid: "d3b2d436-8851-47c2-b079-b6f47ce82006",
    navn: "Høyde DTM 10 meter (UTM35) WMS"
    },
    {
    uuid: "d45a2146-33cf-4c28-a8d9-48a57a99a781",
    navn: "Naturtyper - marine (DN håndbok 19) WMS"
    },
    {
    uuid: "d45a2146-33cf-4c28-a8d9-48a57a99a781",
    navn: "Naturtyper - marine (DN håndbok 19) WMS"
    },
    {
    uuid: "d5718a41-1142-4631-8391-521e369869e2",
    navn: "FKB4 gråtone WMS"
    },
    {
    uuid: "d6849b36-81ce-48e4-9bf9-6e372418e247",
    navn: "MarinTerrengWMS2"
    },
    {
    uuid: "d6aebd82-dc35-4181-a825-beee78e62d8d",
    navn: "INSPIRE Addresses WMS"
    },
    {
    uuid: "d6cc4333-74f5-4712-b425-5924acb6b00e",
    navn: "Drågerosjon"
    },
    {
    uuid: "d70cedfc-fdb2-45cc-a9c6-0b7f09a1e746",
    navn: "Planområde WMS"
    },
    {
    uuid: "d847521e-cca5-4934-a2cf-0cf134757f09",
    navn: "Elvenett Elvis WMS"
    },
    {
    uuid: "d89437af-03ba-40c4-bc9d-c977e9787636",
    navn: "Vegnett WMS"
    },
    {
    uuid: "d952db09-aadf-4414-bc9e-6e9efa0fe117",
    navn: "Støysoner for Forsvarets flyplasser WMS"
    },
    {
    uuid: "d9698234-baf6-4085-ad3f-e1a72050dac9",
    navn: "Vindressurser WMS"
    },
    {
    uuid: "d9698234-baf6-4085-ad3f-e1a72050dac9",
    navn: "Vindressurser WMS"
    },
    {
    uuid: "dcee8bf4-fdf3-4433-a91b-209c7d9b0b0f",
    navn: "Norge i bilder WMS-Ortofoto"
    },
    {
    uuid: "de394500-fd30-405c-ab1d-e3be54d01126",
    navn: "Sentral stedsnavnregistrer 2"
    },
    {
    uuid: "de56cd9f-10d1-4c5b-bf23-f3b0e73264cf",
    navn: "NADAG WMS"
    },
    {
    uuid: "ded2bc25-e1b4-445e-ac18-755d5568d2df",
    navn: "BerggrunnN50WMS"
    },
    {
    uuid: "df7ae5d3-ce98-43c4-a65e-ee77340cb255",
    navn: "Høyde DOM prosjekter sømløs WMS"
    },
    {
    uuid: "df7ae5d3-ce98-43c4-a65e-ee77340cb255",
    navn: "Høyde DOM prosjekter sømløs WMS"
    },
    {
    uuid: "dffb3e01-9186-4372-a2dd-787e0f9c5b05",
    navn: "Store fjellskred WMS"
    },
    {
    uuid: "e247c30c-4099-42ce-b080-2e8690f2861b",
    navn: "Fiskeridirektoratets WMS"
    },
    {
    uuid: "e247c30c-4099-42ce-b080-2e8690f2861b",
    navn: "Fiskeridirektoratets WMS"
    },
    {
    uuid: "e2d3167f-0add-433b-b33c-42e169516e31",
    navn: "INSPIRE Geographical Names WMS"
    },
    {
    uuid: "e43d4fd2-cfad-4feb-ac35-b020be19eb98",
    navn: "RadonWMS2"
    },
    {
    uuid: "e45ac474-df3e-41e9-aa77-2f66691357df",
    navn: "Høyde DOM prosjekter punkttetthet WMS"
    },
    {
    uuid: "e45aea66-5d98-4703-8026-692c782eb5b0",
    navn: "Traktorveg og Skogsbilveg WMS"
    },
    {
    uuid: "e4a89b8c-5c9e-4693-828f-ea813b639f3f",
    navn: "Norges maritime grenser WMS"
    },
    {
    uuid: "e5e2e820-adea-456a-821d-5de3d38d2fbe",
    navn: "Hydrologiske data WMS"
    },
    {
    uuid: "e6601b5b-d528-4880-8380-dbcfb147e03b",
    navn: "Nedbygd jordbruksareal"
    },
    {
    uuid: "e7005390-eae7-4eda-b63f-53f1bd303e44",
    navn: "Fastgrill - WMS"
    },
    {
    uuid: "e7239384-aa0a-4bfb-bd46-b441e6c2735e",
    navn: "NPD FactMaps 3.0 WMS WGS84"
    },
    {
    uuid: "e7239384-aa0a-4bfb-bd46-b441e6c2735e",
    navn: "NPD FactMaps 3.0 WMS WGS84"
    },
    {
    uuid: "e84c9a6d-2297-4323-9078-36ac4b8e35e4",
    navn: "Topografisk Norgeskart graatone"
    },
    {
    uuid: "e85b8d94-64f2-45c3-b84a-c785c9c3c802",
    navn: "Georef 3 WMS"
    },
    {
    uuid: "e98a6c16-efe4-486c-87d4-8dfd06b822b3",
    navn: "Verneplan for vassdrag WMS"
    },
    {
    uuid: "eb48dd19-03da-41e1-afd9-7ebc3079265c",
    navn: "Naturtyper - NiN"
    },
    {
    uuid: "eb911cde-0ac9-48aa-87c0-e6f4c45115f5",
    navn: "Høyde DOM skyggerelieff sømløs WMS"
    },
    {
    uuid: "ec3085b6-0c39-4e5d-a3d3-f2181b0f0051",
    navn: "Søppelkasser - WMS"
    },
    {
    uuid: "ed5399eb-09b6-48e0-a34a-c6fce4401e38",
    navn: "Ringerike kommune kartløsning"
    },
    {
    uuid: "ed8f4a7a-7e04-4680-8ac9-342764b95867",
    navn: "art_naturbase WMS"
    },
    {
    uuid: "ef63146d-c689-4079-97b5-89f04bcfd1ff",
    navn: "friluftsliv_statlig_sikra"
    },
    {
    uuid: "efc76ccd-1de9-42d2-b4f8-6332d3349b1d",
    navn: "Administrative enheter - historiske versjoner WMS"
    },
    {
    uuid: "f004268c-d4a1-4801-91cb-daa46236fab7",
    navn: "Topografisk Norgeskart"
    },
    {
    uuid: "f0ef87bf-91a1-4f00-b864-9655d3d7c1de",
    navn: "Historiske kart WMS"
    },
    {
    uuid: "f2231766-e5f2-4076-b7f8-b45a02bf7221",
    navn: "Artsutbredelse Fisk"
    },
    {
    uuid: "f575582b-a181-4f5b-989a-50bad6e90687",
    navn: "Jordkvalitet - WMS"
    },
    {
    uuid: "f753f8e2-dd56-48e4-a91f-e4fc84c61392",
    navn: "Sjøkart - datakvalitet dybdedata WMS"
    },
    {
    uuid: "f8007522-2b73-4702-bb97-50c720e5c3f8",
    navn: "Skred kvikkleire WMS"
    },
    {
    uuid: "f871159f-a2b3-4dca-a5f6-e89770dd70c5",
    navn: "Sensitive artsdata WMS"
    },
    {
    uuid: "f91f944a-51fe-4d15-8ca8-0612b55d5c14",
    navn: "Inngrepsfri natur på Svalbard WMS"
    },
    {
    uuid: "fa6a495d-05a1-4c0d-ba67-45a1d47fca92",
    navn: "vern WMS"
    },
    {
    uuid: "fb82584b-3ade-4aea-9f3d-e10371a154bb",
    navn: "Sykkelparkering - WMS"
    },
    {
    uuid: "fb82584b-3ade-4aea-9f3d-e10371a154bb",
    navn: "Sykkelparkering - WMS"
    },
    {
    uuid: "fbf38ff5-e562-40b0-84e4-c0f70255300e",
    navn: "Fargeleggingskart"
    },
    {
    uuid: "fc5f7878-8696-47f3-a9a7-d8bf51068203",
    navn: "Flomsoner WMS"
    },
    {
    uuid: "fd19fb25-a517-41f3-bc5b-5401e82f7d1f",
    navn: "Nasjonalt register over luftfartshindre WMS"
    },
    {
    uuid: "fd835b05-7fcb-45ed-8f66-590871ee468d",
    navn: "Langsiktige feltforsøk i skog"
    },
    {
    uuid: "fef17a36-bd9a-4262-af34-8943cd712157",
    navn: "Grunnkretser WMS"
    },
    {
    uuid: "ff2b9b80-70b4-4280-95a5-19ed679d6933",
    navn: "Høyde DTM prosjekter sømløs WMS"
    },
    {
    uuid: "ff2b9b80-70b4-4280-95a5-19ed679d6933",
    navn: "Høyde DTM prosjekter sømløs WMS"
    },
    {
    uuid: "ff879537-4031-4e80-bff0-87d0e0638a7f",
    navn: "Reindrift - WMS"
    }
    ];

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_AVAILABLE_WMS_SERVICE_STATUSES:
            return action.payload;
        default:
            return state;
    }
}

export default reducer;
