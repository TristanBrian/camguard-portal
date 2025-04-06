
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
}

export const productsData: Product[] = [
  {
    id: "p1",
    name: "HD Dome Camera",
    description: "1080p indoor security camera with night vision and motion detection.",
    price: 8999,
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    category: "Indoor",
    difficulty: "Easy",
    stock: 24,
    sku: "CAM-DOME-01"
  },
  {
    id: "p2",
    name: "4K Bullet Camera",
    description: "Professional 4K outdoor camera with 30m IR range and IP67 weatherproof rating.",
    price: 15999,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    category: "Outdoor",
    difficulty: "Medium",
    stock: 18,
    sku: "CAM-BUL-02"
  },
  {
    id: "p3",
    name: "8-Channel NVR",
    description: "Network video recorder with 2TB storage and remote viewing capabilities.",
    price: 29999,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    category: "Recorder",
    difficulty: "Advanced",
    stock: 10,
    sku: "REC-NVR-03"
  },
  {
    id: "p4",
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
    id: "p5",
    name: "Wireless IP Camera",
    description: "Easy to install wireless camera with two-way audio and cloud storage.",
    price: 6999,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    category: "Indoor",
    difficulty: "Easy",
    stock: 30,
    sku: "CAM-IP-05"
  },
  {
    id: "p6",
    name: "PTZ Security Camera",
    description: "Pan-tilt-zoom camera with 360° coverage and automatic tracking.",
    price: 24999,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    category: "Outdoor",
    difficulty: "Advanced",
    stock: 8,
    sku: "CAM-PTZ-06"
  },
  {
    id: "p7",
    name: "16-Channel DVR",
    description: "Digital video recorder with H.265+ compression and multi-site viewing.",
    price: 35999,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    category: "Recorder",
    difficulty: "Advanced",
    stock: 5,
    sku: "REC-DVR-07"
  },
  {
    id: "p8",
    name: "Security Router",
    description: "Enterprise-grade router with firewall protection and VPN capabilities.",
    price: 12999,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    category: "Networking",
    difficulty: "Medium",
    stock: 20,
    sku: "NET-RTR-08"
  }
];
