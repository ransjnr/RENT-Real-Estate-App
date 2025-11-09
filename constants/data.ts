import icons from "./icons";
import images from "./images";

export const cards = [
  {
    title: "Card 1",
    location: "Location 1",
    price: "$100",
    rating: 4.8,
    category: "house",
    image: images.newYork,
  },
  {
    title: "Card 2",
    location: "Location 2",
    price: "$200",
    rating: 3,
    category: "house",
    image: images.japan,
  },
  {
    title: "Card 3",
    location: "Location 3",
    price: "$300",
    rating: 2,
    category: "flat",
    image: images.newYork,
  },
  {
    title: "Card 4",
    location: "Location 4",
    price: "$400",
    rating: 5,
    category: "villa",
    image: images.japan,
  },
];

export const featuredCards = [
  {
    title: "Featured 1",
    location: "Location 1",
    price: "$100",
    rating: 4.8,
    image: images.newYork,
    category: "house",
  },
  {
    title: "Featured 2",
    location: "Location 2",
    price: "$200",
    rating: 3,
    image: images.japan,
    category: "flat",
  },
];

export const categories = [
  { title: "All", category: "All" },
  { title: "Houses", category: "House" },
  { title: "Condos", category: "Condos" },
  { title: "Duplexes", category: "Duplexes" },
  { title: "Studios", category: "Studios" },
  { title: "Villas", category: "Villa" },
  { title: "Apartments", category: "Apartments" },
  { title: "Townhomes", category: "Townhomes" },
  { title: "Others", category: "Others" },
];

export const settings = [
  {
    title: "My Bookings",
    icon: icons.calendar,
  },
  {
    title: "Payments",
    icon: icons.wallet,
  },
  {
    title: "Profile",
    icon: icons.person,
  },
  {
    title: "Notifications",
    icon: icons.bell,
  },
  {
    title: "Security",
    icon: icons.shield,
  },
  {
    title: "Language",
    icon: icons.language,
  },
  {
    title: "Help Center",
    icon: icons.info,
  },
  {
    title: "Invite Friends",
    icon: icons.people,
  },
];

export const facilities = [
  {
    title: "Laundry",
    icon: icons.laundry,
  },
  {
    title: "Car Parking",
    icon: icons.carPark,
  },
  {
    title: "Sports Center",
    icon: icons.run,
  },
  {
    title: "Cutlery",
    icon: icons.cutlery,
  },
  {
    title: "Gym",
    icon: icons.dumbell,
  },
  {
    title: "Swimming pool",
    icon: icons.swim,
  },
  {
    title: "Wifi",
    icon: icons.wifi,
  },
  {
    title: "Pet Center",
    icon: icons.dog,
  },
];

export const gallery = [
  {
    id: 1,
    image: images.newYork,
  },
  {
    id: 2,
    image: images.japan,
  },
  {
    id: 3,
    image: images.newYork,
  },
  {
    id: 4,
    image: images.japan,
  },
  {
    id: 5,
    image: images.newYork,
  },
  {
    id: 6,
    image: images.japan,
  },
];

export const services = [
  {
    id: "1",
    name: "Professional Cleaning Service",
    description:
      "Expert cleaning services for your property. Deep cleaning, regular maintenance, and move-in/out cleaning available.",
    price: 150,
    rating: 4.8,
    category: "Cleaning",
    image: images.newYork,
    provider: "CleanPro Services",
    duration: "2-4 hours",
    availability: "Available 24/7",
  },
  {
    id: "2",
    name: "Property Maintenance",
    description:
      "Comprehensive maintenance services including plumbing, electrical, HVAC, and general repairs.",
    price: 200,
    rating: 4.6,
    category: "Maintenance",
    image: images.japan,
    provider: "FixIt Now",
    duration: "Same day service",
    availability: "Mon-Sat 8AM-6PM",
  },
  {
    id: "3",
    name: "Interior Design Consultation",
    description:
      "Professional interior design services to transform your space. Includes consultation, design plans, and sourcing.",
    price: 300,
    rating: 4.9,
    category: "Design",
    image: images.newYork,
    provider: "Design Studio Pro",
    duration: "2-3 hours",
    availability: "By appointment",
  },
  {
    id: "4",
    name: "Landscaping & Garden Care",
    description:
      "Complete landscaping services including lawn care, garden design, tree trimming, and seasonal maintenance.",
    price: 180,
    rating: 4.7,
    category: "Landscaping",
    image: images.japan,
    provider: "Green Thumb Landscaping",
    duration: "3-5 hours",
    availability: "Mon-Fri 7AM-5PM",
  },
  {
    id: "5",
    name: "Home Security Installation",
    description:
      "Professional security system installation including cameras, alarms, smart locks, and monitoring setup.",
    price: 450,
    rating: 4.8,
    category: "Security",
    image: images.newYork,
    provider: "SecureHome Systems",
    duration: "4-6 hours",
    availability: "By appointment",
  },
  {
    id: "6",
    name: "Moving & Relocation Services",
    description:
      "Full-service moving and relocation assistance. Packing, transportation, and unpacking services available.",
    price: 350,
    rating: 4.5,
    category: "Moving",
    image: images.japan,
    provider: "MoveEasy Relocations",
    duration: "Full day",
    availability: "Mon-Sat 8AM-6PM",
  },
  {
    id: "7",
    name: "Furniture Assembly",
    description:
      "Professional furniture assembly service. We handle IKEA, Wayfair, and all major furniture brands.",
    price: 120,
    rating: 4.7,
    category: "Assembly",
    image: images.newYork,
    provider: "Assembly Experts",
    duration: "1-2 hours",
    availability: "Available 24/7",
  },
  {
    id: "8",
    name: "Smart Home Setup",
    description:
      "Complete smart home installation including smart lights, thermostats, voice assistants, and automation setup.",
    price: 280,
    rating: 4.9,
    category: "Technology",
    image: images.japan,
    provider: "TechHome Solutions",
    duration: "3-4 hours",
    availability: "By appointment",
  },
];
