export interface GasProtocolData {
  protocolNumber: string;
  protocolDate: string;
  
  // Section I: Installer
  installerName: string;
  installerId: string;
  installerAddress: string;

  // Section II: Vehicle
  vehicleRegNo: string;
  vehicleMake: string;
  vehicleModel: string;

  // Section III: Owner

  // Section IV: Installation
  installationDate: string;
  installationType: 'ВНГ' | 'СПГ';
  installationMake: string;
  installationModel: string;

  // Components Table
  components: GasComponent[];

  // Signatures & Issuance
  issuerFullName: string;
  issueDate: string;
  issuePlace: string;
}

export interface GasComponent {
  id: number;
  name: string;
  make: string;
  approvalNumber: string;
  note: string;
  isOptional?: boolean;
  isLpgOnly?: boolean;
  isCngOnly?: boolean;
}

export const INITIAL_COMPONENTS: GasComponent[] = [
  { id: 1, name: "Резервоар за гориво", make: "", approvalNumber: "", note: "" },
  { id: 2, name: "Мултиклапан", make: "", approvalNumber: "", note: "" },
  { id: 3, name: "Пълначно устройство", make: "", approvalNumber: "", note: "" },
  { id: 4, name: "Изпарител", make: "", approvalNumber: "", note: "" },
  { id: 5, name: "Инжектори", make: "", approvalNumber: "", note: "" },
  { id: 6, name: "Електронен блок за управление", make: "", approvalNumber: "", note: "" },
  { id: 7, name: "Тръби и маркучи за газ", make: "", approvalNumber: "", note: "" },
];

export const COMPONENT_OPTIONS: Record<string, Record<string, string[]>> = {
  "Резервоар за гориво": {
    "STEP": ["E7-67R01-612503", "E7-67R01-612508", "E7-67R01-00237-2", "E7-67R01-02606-4", "E7-67R01-02606-3", "E7-67R01- 02606-2", "E6-67R03- 0037", "E7-67R01-1031802", "E37-67R01-0040", "E7-67R01-667406", "E7-67R01-1031808", "E7-67R01-612501", "E7-67R01-1045113", "E7-67R01- 0160302", "E7-67R01-612504", "E7-67R01-612505", "E7-67R01-0160302", "E7-67R01-00237-2", "E7-67R01-1031802", "E7-67R01-1045113"],
    "MCM": ["E13-67R01-0344", "E13-67R01-0394", "Номер 2_3"],
    "КОЛОС": ["Номер 2_1", "Номер 2_2", "Номер 2_3"],
    "Марка": ["Номер 2_1", "Номер 2_2", "Номер 2_3"],
    
  },
  "Мултиклапан": {
    "TOMASETTO": ["E8-67R01-3018", "Номер 1_2"],
    "BRC": ["Номер 2_1", "Номер 2_2"],
    "LOVATO": ["Номер 2_1", "Номер 2_2"],
    "MIMGAS": ["Номер 2_1", "Номер 2_2"],
  },
  "Пълначно устройство": {
    "TOMASETTO": ["E8-67R01-3868"],
    "BRC": ["Номер 2_1", "Номер 2_2"],
    "Марка2": ["Номер 2_1"],
  },
  "Изпарител": {
    "TOMASETTO": ["E8-67R01-4065", "Номер 1_2"],
    "BRC": ["E13-67R01-0016", "Номер 2_2"],
    "PRINS": ["E4-67R01-0358", "Номер 2_2"],
  },
  "Инжектори": {
    "BARRACUDA": ["E8-67R01-6407", "Номер 1_2"],
    "RAIL": ["E8-67R01-4303", "Номер 2_2"],
    "BRC": ["E13-67R03-0223", "Номер 2_2"],
    "PRINS": ["E4-67R01-0093", "Номер 2_2"],
    "HANA": ["Номер 2_2"],
  },
  "Електронен блок за управление": {
    "AEB": ["E3-67R01-6019", "Номер 1_2"],
    "BRC": ["E3-67R01-1002", "Номер 2_2"],
    "PRINS": ["E4-67R01-0098", "Номер 2_2"],
    "Марка2": ["Номер 2_1", "Номер 2_2"],
  },
  "Тръби и маркучи за газ": {
    "WINLAS": ["E37-67R01-0140/04"],
    "FARO": ["E13-67R02-0409"],
  },
};

export const BRAND_KITS: Record<string, Partial<GasComponent>[]> = {
  "AEB": [
    { name: "Резервоар за гориво", make: "STEP", approvalNumber: "E7-67R01-612503" },
    { name: "Мултиклапан", make: "TOMASETTO", approvalNumber: "E8-67R01-3018" },
    { name: "Пълначно устройство", make: "TOMASETTO", approvalNumber: "E8-67R01-3868" },
    { name: "Изпарител", make: "TOMASETTO", approvalNumber: "E8-67R01-4065" },
    { name: "Инжектори", make: "RAIL", approvalNumber: "E8-67R01-430" },
    { name: "Електронен блок за управление", make: "AEB", approvalNumber: "E3-67R01-6019" },
    { name: "Тръби и маркучи за газ", make: "FARO", approvalNumber: "E13-67R02-0409" },
  ],
  "BRC": [
    { name: "Резервоар за гориво", make: "STEP", approvalNumber: "E7-67R01-612503" },
    { name: "Мултиклапан", make: "BRC", approvalNumber: "Номер 2_1" },
    { name: "Пълначно устройство", make: "BRC", approvalNumber: "E8-67R01-3868" },
    { name: "Изпарител", make: "BRC", approvalNumber: "E13-67R01-0016" },
    { name: "Инжектори", make: "BRC", approvalNumber: "E13-67R03-0223" },
    { name: "Електронен блок за управление", make: "BRC", approvalNumber: "E3-67R01-1002" },
    { name: "Тръби и маркучи за газ", make: "FARO", approvalNumber: "E13-67R02-0409" },
  ],
  "PRINS": [
    { name: "Резервоар за гориво", make: "STEP", approvalNumber: "E7-67R01-612503" },
    { name: "Мултиклапан", make: "TOMASETTO", approvalNumber: "E8-67R01-3018" },
    { name: "Пълначно устройство", make: "TOMASETTO", approvalNumber: "E8-67R01-3868" },
    { name: "Изпарител", make: "PRINS", approvalNumber: "E4-67R01-0358" },
    { name: "Инжектори", make: "PRINS", approvalNumber: "E4-67R01-0093" },
    { name: "Електронен блок за управление", make: "PRINS", approvalNumber: "E4-67R01-0098" },
    { name: "Тръби и маркучи за газ", make: "FARO", approvalNumber: "E13-67R02-0409" },
  ]
};
