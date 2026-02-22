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
    "Марка1": ["Номер 1_1", "Номер 1_2", "Номер 1_3"],
    "Марка2": ["Номер 2_1", "Номер 2_2", "Номер 2_3"],
  },
  "Мултиклапан": {
    "Марка1": ["Номер 1_1", "Номер 1_2"],
    "Марка2": ["Номер 2_1", "Номер 2_2"],
  },
  "Пълначно устройство": {
    "Марка1": ["Номер 1_1"],
    "Марка2": ["Номер 2_1"],
  },
  "Изпарител": {
    "Марка1": ["Номер 1_1", "Номер 1_2"],
    "Марка2": ["Номер 2_1", "Номер 2_2"],
  },
  "Инжектори": {
    "Марка1": ["Номер 1_1", "Номер 1_2"],
    "Марка2": ["Номер 2_1", "Номер 2_2"],
  },
  "Електронен блок за управление": {
    "Марка1": ["Номер 1_1", "Номер 1_2"],
    "Марка2": ["Номер 2_1", "Номер 2_2"],
  },
  "Тръби и маркучи за газ": {
    "Марка1": ["Номер 1_1"],
    "Марка2": ["Номер 2_1"],
  },
};
