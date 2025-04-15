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
    description: "The Dahua DH-HAC-T1A21P 2MP is a 2MP 1080P camera that gives you a full HD video experience at an affordable price. The camera supports multiple video formats including HDCVI, CVBS and other common HD analog formats in the market.",
    price: 8999,
    image: "/lovable-uploads/eec54a61-fec4-4ab4-86ae-af63f1331531.png",
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
    image: "/lovable-uploads/adb0b881-8c8f-4542-b73c-cdcb43015dc7.png",
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
    image: "/lovable-uploads/fe4d1c2a-f0d8-45fc-a732-eec5cfce54c0.png",
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
    image: "/lovable-uploads/de5c2337-6aff-4711-8af0-74bf02c3275b.png",
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
    image: "/lovable-uploads/c245619a-b9a2-4fe0-a7a1-89f3e094711f.png",
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
    description: "2MP HDCVI Full-Color Eyeball Camera, designed for superior color imaging in low-light environments, making it a reliable choice for round-the-clock surveillance.",
    price: 12999,
    image: "/lovable-uploads/4d7d7c96-f334-4ae6-b306-a2d5888a5446.png",
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
  },
  {
    id: "dl1",
    name: "D-Link DES-1005C 5-Port Desktop Switch",
    description: "The D-link DES-1005C 5-Port Desktop Switch allows you to quickly set up a fast, reliable, and efficient wired network in your home or office. This unmanaged 10/100Mbps switch is designed to enhance small workgroup performance while providing a high level of flexibility.",
    price: 2999,
    image: "/lovable-uploads/ac2e9f27-012d-4f9a-aa8f-3c5f7e741ee0.png",
    category: "D-Link",
    difficulty: "Easy",
    stock: 30,
    sku: "DL-SW-01",
    features: [
      "5 high-speed Fast Ethernet ports",
      "Innovative D-Link Green energy saving features",
      "Compact design for convenient placement",
      "Fanless design for silent operation"
    ],
    brand: "D-Link",
    model: "DES-1005C"
  },
  {
    id: "dl2",
    name: "D-Link DGS-F1100-10PS-E 8-Port POE Gigabit Switch",
    description: "Professional managed PoE switch with comprehensive management features and smart roaming capabilities.",
    price: 14999,
    image: "/lovable-uploads/e7af41dc-f76c-4a63-ba51-f4883d3ce4aa.png",
    category: "D-Link",
    difficulty: "Medium",
    stock: 15,
    sku: "DL-SW-02",
    features: [
      "8 x 10/10/1000BASE-T PoE ports",
      "2 x SFP ports",
      "Supports IEEE 802.3at PoE",
      "Complete web interface for management",
      "Smart Roaming with unified network name",
      "6 powerful internal antennas"
    ],
    brand: "D-Link",
    model: "DGS-F1100-10PS-E"
  },
  {
    id: "tp1",
    name: "TP-Link TL-WA850RE WiFi Range Extender",
    description: "Extend your WiFi coverage with this easy-to-deploy range extender featuring one-touch setup and flexible placement options.",
    price: 3999,
    image: "/lovable-uploads/ec9e19bb-27e4-4529-ba71-6e29c4fa3688.png",
    category: "TP-Link",
    difficulty: "Easy",
    stock: 25,
    sku: "TP-EXT-01",
    features: [
      "Range Extender mode boosts wireless signal",
      "Miniature size and wall-mounted design",
      "One-touch Range Extender button",
      "Ethernet port for wired connectivity",
      "Tether App for easy management",
      "LED Control with Night Mode"
    ],
    brand: "TP-Link",
    model: "TL-WA850RE"
  },
  {
    id: "tp2",
    name: "TP-Link Archer C80 AC1900 Wireless MU-MIMO Router",
    description: "High-performance dual-band router with advanced features for seamless 4K streaming and gaming.",
    price: 8999,
    image: "/lovable-uploads/1990db62-334d-4b04-bcab-7c919c9578ad.png",
    category: "TP-Link",
    difficulty: "Medium",
    stock: 20,
    sku: "TP-RTR-01",
    features: [
      "Ultra-Fast Dual-Band Speeds up to 1.9 Gbps",
      "Beamforming technology with 4 antennas",
      "MU-MIMO technology for multiple devices",
      "Smart Connect and Airtime Fairness",
      "4 Gigabit LAN ports + 1 WAN port",
      "Advanced Parental Controls",
      "Easy setup with TP-Link Tether App"
    ],
    brand: "TP-Link",
    model: "Archer C80"
  }
];
