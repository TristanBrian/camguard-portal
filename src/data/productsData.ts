
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  stock: number;
  sku: string;
  features?: string[];
  brand?: string;
  model?: string;
}

export const productsData: Product[] = [
  {
    id: "p1",
    name: "Dahua DH-HAC-T1A21P 2MP Eyeball Camera",
    description: "2MP 1080P camera that gives you a full HD video experience at an affordable price. Supports multiple video formats including HDCVI, CVBS and other common HD analog formats in the market.",
    price: 8999,
    image: "/lovable-uploads/1ce459df-ccce-492c-8746-029902369859.png",
    category: "Dahua Tech",
    difficulty: "Easy",
    stock: 24,
    sku: "CAM-DOME-01",
    features: [
      "Max. 30 fps@1080p",
      "CVI/CVBS/AHD/TVI switchable",
      "3.6 mm fixed lens (2.8 mm, 6 mm optional)",
      "Max. IR length 20 m, Smart IR",
      "12 VDC"
    ],
    brand: "Dahua",
    model: "DH-HAC-T1A21P 2MP"
  },
  {
    id: "p2",
    name: "Dahua DH-HAC-B1A21P 2MP Bullet Camera",
    description: "2MP Bullet Camera with switchable video formats for compatible integration with most HD/SD DVRs.",
    price: 9999,
    image: "/lovable-uploads/455c6412-3219-47aa-a853-e33a9ef09c1c.png",
    category: "Dahua Tech",
    difficulty: "Medium",
    stock: 18,
    sku: "CAM-BUL-02",
    features: [
      "Max. 30 fps@1080p",
      "CVI/CVBS/AHD/TVI switchable",
      "3.6 mm fixed lens (2.8 mm, 6 mm optional)",
      "Max. IR length 20 m, Smart IR"
    ],
    brand: "Dahua",
    model: "DH-HAC-B1A21P"
  },
  {
    id: "p3",
    name: "Dahua DH-1PC-HFW2449M-S-B-PRO",
    description: "4MP High-Resolution Video security camera with full-color night vision and smart motion detection.",
    price: 15999,
    image: "/lovable-uploads/fc5a8faf-be2d-4770-8589-d1c96470713f.png",
    category: "Dahua Tech",
    difficulty: "Medium",
    stock: 15,
    sku: "CAM-PRO-03",
    features: [
      "4MP High-Resolution Video",
      "Full-Color Night Vision",
      "Weatherproof Design (IP67)",
      "Smart Motion Detection",
      "Wide Dynamic Range (WDR)",
      "Built-in Microphone",
      "H.265 Video Compression",
      "Easy Installation"
    ],
    brand: "Dahua",
    model: "DH-1PC-HFW2449M-S-B-PRO"
  },
  {
    id: "p4",
    name: "Dahua DH-1PC-HFW244TL-S-PRO",
    description: "4MP HD resolution camera with IR night vision and weatherproof design for reliable outdoor use.",
    price: 14999,
    image: "/lovable-uploads/ffed2d42-4188-4317-8712-674245b22030.png",
    category: "Dahua Tech",
    difficulty: "Medium",
    stock: 12,
    sku: "CAM-PRO-04",
    features: [
      "4MP HD resolution for clear and detailed videos",
      "IR night vision with up to 30m range",
      "Weatherproof (IP67) for reliable outdoor use",
      "H.265 compression to save storage without losing quality",
      "Motion detection for real-time alerts",
      "PoE support for easy installation with a single cable"
    ],
    brand: "Dahua",
    model: "DH-1PC-HFW244TL-S-PRO"
  },
  {
    id: "p5",
    name: "Dahua 5MP HDCVI Bullet Camera",
    description: "High-end 5MP HDCVI Bullet Camera with motorized lens and extended IR range for superior surveillance coverage.",
    price: 22999,
    image: "/lovable-uploads/64fc0dc4-8c99-4edc-a812-bbc687721c7c.png",
    category: "Dahua Tech",
    difficulty: "Advanced",
    stock: 8,
    sku: "CAM-BUL-05",
    features: [
      "Resolution: 5MP (2592 × 1944)",
      "Lens: Motorized lens, 2.7mm to 13.5mm (varifocal)",
      "IR Distance: Up to 50 meters (164 feet)",
      "Video Compression: H.265+/H.265/H.264+/H.264",
      "WDR: 120dB True WDR",
      "Weatherproof Rating: IP67",
      "Power Supply: 12V DC ±30%, PoC support",
      "Operating Temperature: -40°C to +60°C"
    ],
    brand: "Dahua",
    model: "5MP HDCVI Bullet"
  },
  {
    id: "p6",
    name: "Dahua DH-HAC-HDW1209TLQP-LED",
    description: "2MP HDCVI Full-Color Eyeball Camera designed for superior color imaging in low-light environments.",
    price: 12999,
    image: "/lovable-uploads/6c944901-f5c0-45af-a87c-f5360814cea8.png",
    category: "Dahua Tech",
    difficulty: "Easy",
    stock: 20,
    sku: "CAM-EYE-06",
    features: [
      "Full-Color Night Vision with integrated LED illumination",
      "2MP Full HD Resolution (1080p)",
      "Wide Field of View with customizable coverage",
      "IP67 Weather Resistance",
      "HDCVI Technology for real-time HD transmission",
      "Compact Eyeball Design",
      "Cost-Efficient Surveillance"
    ],
    brand: "Dahua",
    model: "DH-HAC-HDW1209TLQP-LED"
  },
  {
    id: "p7",
    name: "8-Channel NVR",
    description: "Network video recorder with 2TB storage and remote viewing capabilities.",
    price: 29999,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    category: "Recorder",
    difficulty: "Advanced",
    stock: 10,
    sku: "REC-NVR-07"
  },
  {
    id: "p8",
    name: "Mesh WiFi System",
    description: "Whole-home coverage with seamless roaming and parental controls.",
    price: 17999,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    category: "Networking",
    difficulty: "Medium",
    stock: 15,
    sku: "NET-MESH-04"
  },
  {
    id: "p9",
    name: "Security Router",
    description: "Enterprise-grade router with firewall protection and VPN capabilities.",
    price: 12999,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    category: "Networking",
    difficulty: "Medium",
    stock: 20,
    sku: "NET-RTR-08"
  },
  {
    id: "p10",
    name: "16-Channel DVR",
    description: "Digital video recorder with H.265+ compression and multi-site viewing.",
    price: 35999,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    category: "Recorder",
    difficulty: "Advanced",
    stock: 5,
    sku: "REC-DVR-10"
  }
];
