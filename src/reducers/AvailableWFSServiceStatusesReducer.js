import {
    FETCH_AVAILABLE_WFS_SERVICE_STATUSES
} from 'actions/types';

const initialState = [
    {
    uuid: "00f64065-9035-4ff4-8f99-c17d50227247",
    navn: "Corine Landcover 2012 (CLC) - Arealdekke - WFS"
    },
    {
    uuid: "0243cceb-a25d-4721-881b-909433f546b1",
    navn: "Særlig verdifulle og sårbare områder WFS"
    },
    {
    uuid: "0257e003-51c8-4a86-ba52-575e762fbabd",
    navn: "Reindrift - Restriksjonsområde - WFS"
    },
    {
    uuid: "05cb3f1b-51e7-455f-9c4c-b21f5d99cce2",
    navn: "Jernbane - Banenettverk WFS"
    },
    {
    uuid: "0c0f114d-a8ee-444d-8a88-93459bccf506",
    navn: "Matrikkelen - Adresse WFS"
    },
    {
    uuid: "0cf7a167-4cd2-4ea0-8c06-445597a99cf6",
    navn: "Steinsprang - aktsomhetsområder"
    },
    {
    uuid: "0dec383e-3d90-4fde-8d5b-1f7c460f640d",
    navn: "Kulturminner - Freda bygninger WFS"
    },
    {
    uuid: "0ed31290-808c-487a-9baa-7ce3cd633d53",
    navn: "Stedsnavn WFS"
    },
    {
    uuid: "0f0967bf-05e6-4dbc-b483-3ce342e4993a",
    navn: "Bergrettigheter WFS"
    },
    {
    uuid: "0f3b4fa0-48ff-461c-b1d0-e36a27d0aa6b",
    navn: "Dyrkbar jord - WFS"
    },
    {
    uuid: "113f3651-cfbd-4a9e-b9fe-54d49021c87f",
    navn: "Lufthavnpunkt Avinor WFS"
    },
    {
    uuid: "11c7ad07-0da6-48df-b89f-a2f35fdece4a",
    navn: "Snøskuter- og barmarksløyper WFS"
    },
    {
    uuid: "12da1291-545a-4ebf-9c4d-bd230c8aa8c1",
    navn: "Verneplan for vassdrag WFS"
    },
    {
    uuid: "13587266-ed0c-4970-91d5-3a677393c393",
    navn: "Reindrift - Konvensjonsområde - WFS"
    },
    {
    uuid: "144b1a0b-f3c0-4e7a-83b6-332a1dc1209d",
    navn: "Jordkvalitet - WFS"
    },
    {
    uuid: "14f65997-f8b2-4a4a-8f12-0e825c0cd7c7",
    navn: "Mapserver WFS - www.nordatlas.no"
    },
    {
    uuid: "1559d17b-b807-4dee-91a1-c7891f19a52a",
    navn: "SEAPOP Estimerte hekkebestander for sjøfugl WFS"
    },
    {
    uuid: "1765495c-cfce-49d1-899e-321e2c421f39",
    navn: "Akvakultur - lokaliteter WFS"
    },
    {
    uuid: "1823714a-3f0d-4d0e-b9a4-05c0c2dfeb52",
    navn: "Statistisk havisfrekvens for Arktis 1987-2016"
    },
    {
    uuid: "18258934-0a8f-491b-9607-a3cb5754fa12",
    navn: "Snø- og steinskred - aktsomhetsområder WFS"
    },
    {
    uuid: "19a5e9c7-ce23-46e9-916d-68e8a225b209",
    navn: "WFS for dekningsoversikt"
    },
    {
    uuid: "1a0206f2-42b8-4fff-85f4-3a84a67a753a",
    navn: "INSPIRE ElevationVectorElements WFS"
    },
    {
    uuid: "1bf669a2-3c11-4173-a96a-9df7a9656649",
    navn: "Hovedområder"
    },
    {
    uuid: "1ccbddfe-9374-4e5b-b4bc-692765b33774",
    navn: "fldByStatus"
    },
    {
    uuid: "1de00b66-216e-44be-8724-04ac62f3f530",
    navn: "Reindrift - Ekspropriasjonsområde - WFS"
    },
    {
    uuid: "1ff382ea-f575-48bb-bea1-33fc1fa8a42a",
    navn: "Befolkning på grunnkretsnivå 2017 WFS"
    },
    {
    uuid: "237aad42-8e68-4e05-9886-98ac1d4364ef",
    navn: "Postnummerområder WFS"
    },
    {
    uuid: "25aa2501-8124-481b-b9bf-4ef009b543b9",
    navn: "prlCurrent"
    },
    {
    uuid: "290e3e93-2811-4859-9b5b-08c608e4678f",
    navn: "Transport Networks - Water WFS"
    },
    {
    uuid: "2ae18722-55bf-490c-a810-facd5c2b0c59",
    navn: "Kulturminner - Kulturmiljøer WFS"
    },
    {
    uuid: "31c7b0c7-0e76-45e5-8f52-3ec50d18fa39",
    navn: "Reindrift - Årstidsbeite - Sommerbeite - WFS"
    },
    {
    uuid: "339d49c3-06a5-4310-9605-fced1fe465cb",
    navn: "Matrikkelen - Eiendomskart Teig WFS"
    },
    {
    uuid: "361fc452-4420-4b86-b203-b451d0d33c7b",
    navn: "prlAll"
    },
    {
    uuid: "37a362e9-df6a-4c07-ba92-566fa90a5da3",
    navn: "ELF PhysicalWaters WFS"
    },
    {
    uuid: "37b0198c-6eef-4810-92af-0332cfb2b339",
    navn: "Forvaltningsplanområder for havområdene WFS"
    },
    {
    uuid: "3bec7256-86c2-4d43-a122-0760a6a21790",
    navn: "Tilgjengelighet - tettsted WFS"
    },
    {
    uuid: "3eef614a-b82f-4779-8a30-02876b792d1a",
    navn: "Nødhavner WFS"
    },
    {
    uuid: "411a0773-949c-475f-bbb4-bba2237bddaf",
    navn: "Fiskeridirektoratets WFS"
    },
    {
    uuid: "42bba2c3-59ef-4ee8-9463-5bd9bdc8af9b",
    navn: "Reindrift - Reindriftsanlegg - WFS"
    },
    {
    uuid: "42e58e93-13da-4f47-8c1c-3525af7c3e77",
    navn: "Hovedled og biled WFS"
    },
    {
    uuid: "4540f3cd-115d-4a35-951e-5da4a4dc8944",
    navn: "Støysoner Avinors lufthavner WFS"
    },
    {
    uuid: "4899555a-d270-4e08-8b72-ae1963a19e34",
    navn: "Reindrift - Reinbeitedistrikt - WFS"
    },
    {
    uuid: "4a121d8e-e271-4f47-b063-17cc9347b4f6",
    navn: "Reindrift - Årstidsbeite - Vinterbeite - WFS"
    },
    {
    uuid: "4c462901-2c58-44ca-9987-15abf566ed51",
    navn: "Reindrift - Reinbeiteområde - WFS"
    },
    {
    uuid: "4d65f0a5-e2c5-493c-b641-73c24577f685",
    navn: "Vannkraft WFS"
    },
    {
    uuid: "4e3c59b4-528f-4806-ada3-e9455c9b7d4e",
    navn: "Korallrev WFS"
    },
    {
    uuid: "506a1f33-14d2-4a5b-adb7-e62745faff2b",
    navn: "Kongekrabbe regulering"
    },
    {
    uuid: "5247832f-9f6d-46c6-a1ff-9d0fa5371ec1",
    navn: "Sentrumssoner WFS"
    },
    {
    uuid: "5251a411-943b-47ec-a445-73e741ed9b55",
    navn: "Støysoner for Forsvarets flyplasser WFS"
    },
    {
    uuid: "536699c0-f5f8-4917-b770-abe718f298f1",
    navn: "Kirkebygg - forenklet WFS"
    },
    {
    uuid: "545d6566-6ada-4034-86ba-66539c6958e4",
    navn: "Korallrev WFS HI"
    },
    {
    uuid: "5562076b-fbb8-41fb-89cc-0321ce99db4c",
    navn: "Ramsar WFS"
    },
    {
    uuid: "57c7fca8-c652-44f0-9762-688614891286",
    navn: "Administrative enheter WFS"
    },
    {
    uuid: "5d4bf63a-ebb0-427a-8e67-e9c2351b4eea",
    navn: "Trafikkulykker WFS"
    },
    {
    uuid: "60d160c9-559b-4ff9-a761-c236025b9599",
    navn: "Støysoner for Forsvarets skyte- og øvingsfelt WFS"
    },
    {
    uuid: "61099c3d-06d4-4ace-bda1-a83d8a78d36b",
    navn: "Korallrev - forbudsområder"
    },
    {
    uuid: "66a366e5-59c0-45fe-8750-dbf8a92594de",
    navn: "Støysoner for Bane NORs jernbanenett WFS"
    },
    {
    uuid: "674aa14a-1c61-478f-9230-f2417baea240",
    navn: "Kulturminner - SEFRAK-bygninger WFS"
    },
    {
    uuid: "68eb7647-cd2e-4d76-ad0c-44ff459b7656",
    navn: "Kulturminner - Verneverdig tette trehusmiljøer WFS"
    },
    {
    uuid: "6bdf8e6a-da7a-4a71-95b5-d538b0dac0d1",
    navn: "NPD FactMaps 3.0 WFS WGS84"
    },
    {
    uuid: "6bead333-1a83-4f31-b2c9-0b80ce5df506",
    navn: "Husmannsplasser - Vang historielag"
    },
    {
    uuid: "6ee27514-1982-42ff-a2b2-27bd14ed6745",
    navn: "Kulturminner - Sikringssoner WFS"
    },
    {
    uuid: "714b22ae-63bd-4e04-9676-8f8b86646584",
    navn: "Verneområde - bunnhabitat"
    },
    {
    uuid: "72f851eb-0ca8-4c24-8e7a-51b8ee8c1294",
    navn: "Stormflo WFS"
    },
    {
    uuid: "73e46cf4-d9f5-4d75-b148-bb5edf888c4a",
    navn: "Navigasjonsinstallasjoner WFS"
    },
    {
    uuid: "7b9270dc-1ddd-4012-aeac-0f1fdbdcd704",
    navn: "Skjelsandskonsesjonsområder WFS"
    },
    {
    uuid: "7be0d1f1-9de7-4cda-8e64-9b045e513722",
    navn: "NPD FactMaps 3.0 WFS ED50"
    },
    {
    uuid: "7ef006f0-8229-4ba3-a3b6-06249fbd1a72",
    navn: "Artskart fremmede arter WFS"
    },
    {
    uuid: "81261f68-0895-42fa-ac81-99c6341608fb",
    navn: "Låssettingsplasser WFS"
    },
    {
    uuid: "82108d7c-c4ab-41c3-bda5-95049dcfdd50",
    navn: "Brannstasjoner WFS"
    },
    {
    uuid: "82770fd4-633d-48cc-9056-3d5fba5891c2",
    navn: "Forsvarets skyte- og øvingsfelt WFS"
    },
    {
    uuid: "8288bbde-b916-464f-98e2-f736d4c3bff6",
    navn: "Reindrift - Årstidsbeite - Vårbeite - WFS"
    },
    {
    uuid: "82d99220-1004-4904-882b-4bda4a0f2797",
    navn: "Subområder"
    },
    {
    uuid: "841f7c1d-7cfb-4775-ab27-9bed06b624c7",
    navn: "Lokasjoner"
    },
    {
    uuid: "8450dff4-3d3c-46ce-a5f0-d382893dfe21",
    navn: "INSPIRE Addresses (ELF) WFS"
    },
    {
    uuid: "8714f6a7-c981-493b-afb1-2e4133b621de",
    navn: "dscAll"
    },
    {
    uuid: "882e96f2-94c9-4119-91ed-692a09adbcf9",
    navn: "Tur- og friluftsruter WFS"
    },
    {
    uuid: "8d1550dd-34d8-4171-8a1e-544af46a8093",
    navn: "O-kartregisteret WFS"
    },
    {
    uuid: "8e1765d3-6ec0-4745-8ff5-4aaa51fb9f2f",
    navn: "Skoler WFS"
    },
    {
    uuid: "951593f0-414e-4df7-b330-f27a417c6ed3",
    navn: "Sivilforsvarsdistrikter WFS"
    },
    {
    uuid: "96d173e1-f34d-4a9b-a63a-cde180c084b0",
    navn: "Radioaktivitet i marint miljø WFS"
    },
    {
    uuid: "9bb12a44-8f3a-469c-b78f-676e6e5f6a48",
    navn: "INSPIRE Sea Regions WFS"
    },
    {
    uuid: "9d04250e-ed32-4432-a772-bc098fe4b75f",
    navn: "INSPIRE Administrative Units WFS"
    },
    {
    uuid: "9e53fe8a-354b-4cc8-bf1f-e98ed4b0315c",
    navn: "INSPIRE Cadastral Parcels WFS"
    },
    {
    uuid: "a17966d4-a501-45b2-a2a2-f96c98e064d3",
    navn: "prlCurrentByOperator"
    },
    {
    uuid: "a2408b67-1e66-4393-b258-e78ee3853fe2",
    navn: "Nasjonale laksefjorder WFS"
    },
    {
    uuid: "a4b35740-dd0c-4fc7-ac6f-3a45dbec6023",
    navn: "Statistiske enheter grunnkretser 2019 WFS"
    },
    {
    uuid: "a7949917-033c-4e78-8c0f-e30323ce353a",
    navn: "Arealressurskart - AR50 - WFS"
    },
    {
    uuid: "a9e500fb-c188-4601-81b4-072c36a60c8c",
    navn: "Artskart rødlistearter WFS"
    },
    {
    uuid: "aa79c34c-7e20-4127-be84-85a2ca69386f",
    navn: "Barnehager WFS"
    },
    {
    uuid: "ab49b9f1-9f55-44d2-8fbc-f10b422a9dc2",
    navn: "fclFixed"
    },
    {
    uuid: "ac362432-3909-485c-8e73-37f41bd80bc7",
    navn: "qadAll"
    },
    {
    uuid: "b0c1513c-09da-4569-ae49-035f17081f2e",
    navn: "Kulturminner - Lokaliteter WFS"
    },
    {
    uuid: "b10c5243-c629-4cd9-b13e-64bb03c981ca",
    navn: "INSPIRE Geographical Names (ELF) WFS"
    },
    {
    uuid: "b1de138e-e482-4089-864c-8cb7f10dc1fd",
    navn: "Jord- og flomskred aktsomhetsområder WFS"
    },
    {
    uuid: "b2c6f249-0c19-45c0-a91a-8f873d2c3c4f",
    navn: "Tråling forbudsområder"
    },
    {
    uuid: "b430d8d5-7177-4e4e-8952-7d20ce15bedd",
    navn: "Reindrift - Konsesjonsområde - WFS"
    },
    {
    uuid: "b47f1a68-1d6c-4e4e-ae9a-62456327c2be",
    navn: "Forsvarets snøskreddata WFS"
    },
    {
    uuid: "b6d9b34e-3450-480b-bf05-521c39d31422",
    navn: "Kulturminner i Skedsmo kommune - lokale data WFS"
    },
    {
    uuid: "b9ac457d-9158-49b2-96dd-4bcba0c641c0",
    navn: "Snøskred - aktsomhetsområder WFS"
    },
    {
    uuid: "bbb09c4e-f025-455c-81a0-37ee26bd3e15",
    navn: "Flomsoner WFS"
    },
    {
    uuid: "bca48668-fe4d-43a1-a5c6-2375d952c32f",
    navn: "Reindrift - Trekklei - WFS"
    },
    {
    uuid: "bd4c56e8-383f-4048-acd5-86aea32e457c",
    navn: "Markagrensen WFS"
    },
    {
    uuid: "bfa4fb1f-23f6-4d22-872b-b56dac559cbd",
    navn: "Reindrift - Årstidsbeite - Høstbeite - WFS"
    },
    {
    uuid: "c1f5f3de-ce2d-4104-bee3-2560c5a5a948",
    navn: "INSPIRE LandCoverVector WFS"
    },
    {
    uuid: "c5b83478-8eaa-4fb7-a5a8-2ce99a89790e",
    navn: "Statlige planretningslinjer for differensiert forvaltning av strandsonen langs sjøen WFS"
    },
    {
    uuid: "c6082425-8133-4f4d-bc46-8960c78232ce",
    navn: "Fiskeredskaper - aktive redskap WFS"
    },
    {
    uuid: "c750a3f5-1cb8-46aa-a5eb-e13ee0cb9689",
    navn: "Matrikkelen - Bygningspunkt WFS"
    },
    {
    uuid: "c7c60343-b7e6-4ce5-babc-7e1d8a404fce",
    navn: "INSPIRE - Protected Sites WFS"
    },
    {
    uuid: "cbe4baab-94c0-449b-bea9-ce1084cf373d",
    navn: "Kulturminner - Brannsmitteområder WFS"
    },
    {
    uuid: "cda161f7-94d7-41ba-9f31-786a2e5c5ae7",
    navn: "Statistiske enheter grunnkretser 2018 WFS"
    },
    {
    uuid: "cfd4c6e4-c52b-4e73-9a45-f11099b9b34f",
    navn: "Forurenset grunn i Skedsmo kommune - WFS"
    },
    {
    uuid: "d0452c81-39c9-4a21-a85a-cb1d67f8d29f",
    navn: "Hav og is; Iskart i arktis"
    },
    {
    uuid: "d20ad767-b618-4d15-8038-13c7ffce8faf",
    navn: "Skredhendelser WFS"
    },
    {
    uuid: "d518494d-10ee-477c-82bd-2af1e89b3b11",
    navn: "Tare - høstefelt WFS"
    },
    {
    uuid: "d5c89426-417d-4868-8b73-7679ff491446",
    navn: "blcAll"
    },
    {
    uuid: "d76220cd-a25c-4eca-9229-cd5099f6ddaf",
    navn: "Valgkretser WFS"
    },
    {
    uuid: "d8760d68-e76c-4b59-9fa3-7d926972659e",
    navn: "Befolkning på grunnkretsnivå 2016 WFS"
    },
    {
    uuid: "d98b4ad5-5f97-4c93-bc6b-5b30e033b6bd",
    navn: "Statistiske enheter grunnkretser 2017 WFS"
    },
    {
    uuid: "dc0f80e3-3f4d-486b-9393-da8244f37e47",
    navn: "INSPIRE Buildings (ELF) WFS"
    },
    {
    uuid: "dc13265e-bad3-4dda-a0b7-3987a4f9732c",
    navn: "Reindrift - Avtaleområde - WFS"
    },
    {
    uuid: "de5877fb-2ea3-4eec-96d3-eff2ec5f4c5a",
    navn: "Byggeforbudssoner kraftledninger WFS"
    },
    {
    uuid: "e08b5bc3-59cf-473f-89e1-30fe02795629",
    navn: "Reindrift - Siidaområde - WFS"
    },
    {
    uuid: "e19e7e0f-07a8-4636-b3f6-4ba560b1136d",
    navn: "Reindrift - Årstidsbeite - Høstvinterbeite - WFS"
    },
    {
    uuid: "e234a43b-72a5-4fa3-8ed1-8dfa29de6ecf",
    navn: "Brannalarmsentraler WFS"
    },
    {
    uuid: "e324a2da-b7d5-40f7-9f9a-2e045174dc80",
    navn: "Reindrift - Beitehage - WFS"
    },
    {
    uuid: "e4aed7d6-a0ef-4e48-9628-fadaa3e7f53b",
    navn: "Kvikkleire WFS"
    },
    {
    uuid: "e4ca461a-a23c-48a0-8659-b72af0b231fc",
    navn: "DSBs WFS-tjenester"
    },
    {
    uuid: "e4dce4f5-d7e0-400b-82e4-8fcf7fc1aa29",
    navn: "Trafikkmengde WFS"
    },
    {
    uuid: "e6131a02-7b51-4d4f-968e-d6822c425dfe",
    navn: "WFS - alle datasett fra Statistisk Sentralbyrå"
    },
    {
    uuid: "e8c675c4-ada7-427e-8103-abf891b824b9",
    navn: "Korallrev - forbudsområder WFS"
    },
    {
    uuid: "e9bb34bf-5bc0-43b0-a406-4c6066ff2490",
    navn: "Tilgjengelighet - friluft WFS"
    },
    {
    uuid: "eab0d424-d810-4b24-8462-a49ccab14314",
    navn: "Interkommunale brannvesen WFS"
    },
    {
    uuid: "ebe05e74-0665-42e9-a4c1-f713010d61a7",
    navn: "Reindrift - Flyttlei - WFS"
    },
    {
    uuid: "edf2942d-fa03-4e7f-af3b-f8115381fba5",
    navn: "Kulturminner - Enkeltminner WFS"
    },
    {
    uuid: "f1eb6110-66a7-4e8b-a55a-4e43ad347443",
    navn: "Gyteområder WFS"
    },
    {
    uuid: "f323a1b7-0fb4-4de3-b02d-b0ae4bcc8458",
    navn: "Arealbruk WFS"
    },
    {
    uuid: "f38e7e46-bbe1-49ea-b221-e034c81fce1d",
    navn: "Traktorveg og Skogsbilveg WFS"
    },
    {
    uuid: "f5f79615-8ce0-49d5-995b-0674f046f435",
    navn: "Skredfaresoner WFS"
    },
    {
    uuid: "f6451bea-403e-4fa3-9648-a87d542e9a33",
    navn: "INSPIRE Road Transport Network WFS"
    },
    {
    uuid: "f853e52a-2ede-4ca4-a6cb-a306da513cf2",
    navn: "SEAPOP Bestander for sjøfugl i åpent hav WFS"
    },
    {
    uuid: "fa5df2ef-373d-48b3-8944-6b12f84af0c4",
    navn: "wlbExplorationActive"
    },
    {
    uuid: "fc042eab-9694-4ec8-ae50-64a7afdc4893",
    navn: "Reindrift - Oppsamlingsområde - WFS"
    }
    ];

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_AVAILABLE_WFS_SERVICE_STATUSES:
            return action.payload;
        default:
            return state;
    }
}

export default reducer;
