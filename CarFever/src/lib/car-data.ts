export interface CarListing {
  id: number;
  title: string;
  price: number; // e.g., 4550000 for 45.5 Lacs
  priceDisplay: string; // "PKR 45.5 Lacs"
  year: number;
  mileage: string;
  mileageNumber: number; // e.g., 12000
  fuel: string;
  location: string;
  make: string;
  model: string;
  image: string;
  images?: string[];
  badge?: string;
  rating?: number;
  engine?: string;
  transmission?: string;
  description?: string;
  features?: string[];
}

export const SAMPLE_CARS: CarListing[] = [
  {
    id: 1,
    title: "Toyota Corolla GLi 1.3 VVTi",
    price: 4550000,
    priceDisplay: "PKR 45.5 Lacs",
    year: 2023,
    mileage: "12,000 km",
    mileageNumber: 12000,
    fuel: "Petrol",
    location: "DHA Phase 6, Lahore",
    make: "Toyota",
    model: "Corolla",
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0637?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503378462226-94918fad2511?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80"
    ],
    badge: "Certified",
    rating: 4.8,
    engine: "1300 cc",
    transmission: "Manual",
    description: "Up for sale is a meticulously maintained Toyota Corolla GLi 2023 model. This car has been strictly driven in Lahore and is in total pristine condition. It comes with a powerful 1300 cc engine that delivers excellent fuel economy without compromising on performance.",
    features: ["ABS Brakes", "Airbags", "Power Windows", "Power Steering", "Immobilizer Key", "Keyless Entry", "Alloy Rims", "Rear Camera"]
  },
  {
    id: 2,
    title: "Honda Civic Oriel 1.5 Turbo VTEC",
    price: 8200000,
    priceDisplay: "PKR 82.0 Lacs",
    year: 2024,
    mileage: "5,200 km",
    mileageNumber: 5200,
    fuel: "Petrol",
    location: "F-7, Islamabad",
    make: "Honda",
    model: "Civic",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0637?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503378462226-94918fad2511?auto=format&fit=crop&w=1200&q=80"
    ],
    badge: "Hot Deal",
    rating: 4.9,
    engine: "1500 cc",
    transmission: "Automatic",
    description: "Fully loaded Honda Civic Oriel 1.5 Turbo 2024. Scratchless body, bumper to bumper genuine, first owner, maintained from Honda dealership. Leather seats, electric sunroof, and driver assistance package included.",
    features: ["ABS Brakes", "Airbags", "Power Windows", "Power Steering", "Sunroof", "Keyless Entry", "Alloy Rims", "Rear Camera", "Cruise Control", "Leather Seats"]
  },
  {
    id: 3,
    title: "KIA Sportage AWD",
    price: 7800000,
    priceDisplay: "PKR 78.0 Lacs",
    year: 2023,
    mileage: "18,500 km",
    mileageNumber: 18500,
    fuel: "Petrol",
    location: "Clifton, Karachi",
    make: "KIA",
    model: "Sportage",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503378462226-94918fad2511?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80"
    ],
    badge: "Certified",
    rating: 4.7,
    engine: "2000 cc",
    transmission: "Automatic",
    description: "Excellent family SUV KIA Sportage AWD 2023 model in pristine white. Panoramic sunroof, AWD capability, heated seats, dual-zone climate control, and low mileage make this a prime pick.",
    features: ["ABS Brakes", "Airbags", "Power Windows", "Power Steering", "Sunroof", "Alloy Rims", "Rear Camera", "Cruise Control", "Leather Seats", "All-Wheel Drive"]
  },
  {
    id: 4,
    title: "Hyundai Tucson GLS Sport",
    price: 7350000,
    priceDisplay: "PKR 73.5 Lacs",
    year: 2022,
    mileage: "28,000 km",
    mileageNumber: 28000,
    fuel: "Petrol",
    location: "Saddar, Rawalpindi",
    make: "Hyundai",
    model: "Tucson",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503378462226-94918fad2511?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80"
    ],
    badge: "Popular",
    rating: 4.6,
    engine: "2000 cc",
    transmission: "Automatic",
    description: "Beautiful Hyundai Tucson 2022 GLS Sport. Features an elegant build, leather cockpit, electric tailgate, electronic stability control, and outstanding suspension performance.",
    features: ["ABS Brakes", "Airbags", "Power Windows", "Power Steering", "Sunroof", "Alloy Rims", "Rear Camera", "Cruise Control", "Leather Seats"]
  },
  {
    id: 5,
    title: "Suzuki Swift GLX CVT",
    price: 4150000,
    priceDisplay: "PKR 41.5 Lacs",
    year: 2024,
    mileage: "3,500 km",
    mileageNumber: 3500,
    fuel: "Petrol",
    location: "Gulberg, Lahore",
    make: "Suzuki",
    model: "Swift",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0637?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0637?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503378462226-94918fad2511?auto=format&fit=crop&w=1200&q=80"
    ],
    badge: "Best Value",
    rating: 4.5,
    engine: "1200 cc",
    transmission: "Automatic",
    description: "Almost brand new Suzuki Swift GLX CVT 2024. High-spec luxury hatchback. Features push-button start, LED DRLs, digital climate control, cruise control, and superb fuel average.",
    features: ["ABS Brakes", "Airbags", "Power Windows", "Power Steering", "Keyless Entry", "Alloy Rims", "Rear Camera", "Cruise Control"]
  },
  {
    id: 6,
    title: "Toyota Aqua G Hybrid",
    price: 3850000,
    priceDisplay: "PKR 38.5 Lacs",
    year: 2020,
    mileage: "65,000 km",
    mileageNumber: 65000,
    fuel: "Hybrid",
    location: "Defence, Karachi",
    make: "Toyota",
    model: "Aqua",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0637?auto=format&fit=crop&w=1200&q=80"
    ],
    badge: "Fuel Saver",
    rating: 4.7,
    engine: "1500 cc",
    transmission: "Automatic",
    description: "Highly fuel-efficient import model Toyota Aqua G Grade Hybrid. Delivers 24+ km/l in city driving. Meticulously maintained battery pack, genuine auction sheet available.",
    features: ["ABS Brakes", "Airbags", "Power Windows", "Power Steering", "Keyless Entry", "Alloy Rims", "Rear Camera", "Push Start"]
  },
  {
    id: 7,
    title: "Honda Vezel RS Hybrid",
    price: 5900000,
    priceDisplay: "PKR 59.0 Lacs",
    year: 2021,
    mileage: "42,000 km",
    mileageNumber: 42000,
    fuel: "Hybrid",
    location: "Bahria Town, Islamabad",
    make: "Honda",
    model: "Vezel",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80"
    ],
    badge: "Imported",
    rating: 4.8,
    engine: "1500 cc",
    transmission: "Automatic",
    description: "Imported Honda Vezel RS Hybrid 2021 model. Orange/black leather interior accents, paddle shifters, dynamic sport mode, lane keep assist, and radar adaptive cruise control.",
    features: ["ABS Brakes", "Airbags", "Power Windows", "Power Steering", "Alloy Rims", "Rear Camera", "Cruise Control", "Leather Seats", "Push Start"]
  },
  {
    id: 8,
    title: "Suzuki Alto VXL AGS",
    price: 2750000,
    priceDisplay: "PKR 27.5 Lacs",
    year: 2022,
    mileage: "18,000 km",
    mileageNumber: 18000,
    fuel: "Petrol",
    location: "Samundri Road, Faisalabad",
    make: "Suzuki",
    model: "Alto",
    image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0637?auto=format&fit=crop&w=1200&q=80"
    ],
    badge: "Eco Pick",
    rating: 4.4,
    engine: "660 cc",
    transmission: "Automatic",
    description: "Highly economical 660cc Suzuki Alto VXL AGS 2022 model. Standard daily driver, single owner, completely factory condition. Delivers exceptional utility.",
    features: ["ABS Brakes", "Airbags", "Power Windows", "Power Steering", "Keyless Entry", "AC", "Touchscreen"]
  },
  {
    id: 9,
    title: "KIA Picanto 1.0 AT",
    price: 3100000,
    priceDisplay: "PKR 31.0 Lacs",
    year: 2021,
    mileage: "31,000 km",
    mileageNumber: 31000,
    fuel: "Petrol",
    location: "DHA Phase 2, Islamabad",
    make: "KIA",
    model: "Picanto",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0637?auto=format&fit=crop&w=1200&q=80"
    ],
    badge: "Compact",
    rating: 4.3,
    engine: "1000 cc",
    transmission: "Automatic",
    description: "KIA Picanto 1.0 Automatic 2021. Sleek metallic grey, compact and highly manoeuvrable in tight city traffic. Fully serviced at authorized KIA centers.",
    features: ["ABS Brakes", "Airbags", "Power Windows", "Power Steering", "Keyless Entry", "Alloy Rims", "Rear Wiper"]
  },
  {
    id: 10,
    title: "Hyundai Elantra GLS 2.0",
    price: 6300000,
    priceDisplay: "PKR 63.0 Lacs",
    year: 2023,
    mileage: "14,500 km",
    mileageNumber: 14500,
    fuel: "Petrol",
    location: "Gulshan-e-Iqbal, Karachi",
    make: "Hyundai",
    model: "Elantra",
    image: "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503378462226-94918fad2511?auto=format&fit=crop&w=1200&q=80"
    ],
    badge: "Luxury Ride",
    rating: 4.7,
    engine: "2000 cc",
    transmission: "Automatic",
    description: "Premium executive sedan Hyundai Elantra 2.0 GLS. Boasts a massive power delivery, leather interior, sunroof, wireless charging, and dynamic LED headlights.",
    features: ["ABS Brakes", "Airbags", "Power Windows", "Power Steering", "Sunroof", "Alloy Rims", "Rear Camera", "Cruise Control", "Leather Seats", "Wireless Charger"]
  },
  {
    id: 11,
    title: "Toyota Fortuner 2.7 V",
    price: 13800000,
    priceDisplay: "PKR 138.0 Lacs",
    year: 2022,
    mileage: "29,000 km",
    mileageNumber: 29000,
    fuel: "Petrol",
    location: "Cantt, Lahore",
    make: "Toyota",
    model: "Fortuner",
    image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80"
    ],
    badge: "Big SUV",
    rating: 4.8,
    engine: "2700 cc",
    transmission: "Automatic",
    description: "Grand 7-seater SUV Toyota Fortuner 2.7 V Petrol. Dual-zone digital climate control, electric seats, power tailgate, and 4x4 options. Perfect for highway cruising and off-roading.",
    features: ["ABS Brakes", "Airbags", "Power Windows", "Power Steering", "Alloy Rims", "Rear Camera", "Cruise Control", "Leather Seats", "Electric Seats", "4x4 Drive"]
  },
  {
    id: 12,
    title: "Tesla Model 3 Long Range",
    price: 16500000,
    priceDisplay: "PKR 165.0 Lacs",
    year: 2021,
    mileage: "23,000 km",
    mileageNumber: 23000,
    fuel: "Electric",
    location: "DHA Phase 8, Karachi",
    make: "Tesla",
    model: "Model 3",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503378462226-94918fad2511?auto=format&fit=crop&w=1200&q=80"
    ],
    badge: "Full Electric",
    rating: 4.9,
    engine: "Dual Motor",
    transmission: "Automatic",
    description: "Futuristic Tesla Model 3 Long Range. Dual Motor AWD setup, pristine white leather seats, massive touchscreen dashboard, Autopilot capabilities, and range of 500+ km per charge.",
    features: ["ABS Brakes", "Airbags", "Power Windows", "Power Steering", "Glass Roof", "Alloy Rims", "360 Camera", "Autopilot", "Leather Seats", "All-Wheel Drive"]
  }
];

export function getAllCars(): CarListing[] {
  return SAMPLE_CARS;
}

export function getCarById(id: number): CarListing | undefined {
  return SAMPLE_CARS.find(car => car.id === id);
}
