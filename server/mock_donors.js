// 30 Simulated Volunteer Blood Donors geolocated across Chennai neighborhoods
// Hospital Dispatch HQ: Apollo ER Trauma Center, Greams Road, Chennai (lat: 13.0600, lng: 80.2400)

export const initialDonors = [
  {
    id: "donor-101",
    name: "Dr. Sarah Chen",
    bloodGroup: "O-",
    phone: "+91 98401 92831",
    reliabilityScore: 0.98,
    daysSinceLastDonation: 72,
    lat: 13.0580, // Nungambakkam
    lng: 80.2430,
    status: "AVAILABLE",
    totalDonations: 14,
    gender: "Female",
    age: 31,
    verifiedMedical: true,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "donor-102",
    name: "Marcus Vance",
    bloodGroup: "A+",
    phone: "+91 98402 49920",
    reliabilityScore: 0.94,
    daysSinceLastDonation: 95,
    lat: 13.0405, // T. Nagar
    lng: 80.2335,
    status: "AVAILABLE",
    totalDonations: 8,
    gender: "Male",
    age: 28,
    verifiedMedical: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "donor-103",
    name: "Elena Rostova",
    bloodGroup: "O-",
    phone: "+91 98403 83341",
    reliabilityScore: 0.96,
    daysSinceLastDonation: 120,
    lat: 13.0700, // Chetpet
    lng: 80.2350,
    status: "AVAILABLE",
    totalDonations: 19,
    gender: "Female",
    age: 34,
    verifiedMedical: true,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "donor-104",
    name: "David Kim",
    bloodGroup: "B+",
    phone: "+91 98404 78832",
    reliabilityScore: 0.91,
    daysSinceLastDonation: 64,
    lat: 13.0780, // Egmore
    lng: 80.2600,
    status: "AVAILABLE",
    totalDonations: 6,
    gender: "Male",
    age: 26,
    verifiedMedical: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "donor-105",
    name: "Aisha Patel",
    bloodGroup: "AB-",
    phone: "+91 98405 24411",
    reliabilityScore: 0.99,
    daysSinceLastDonation: 110,
    lat: 13.0520, // Kodambakkam
    lng: 80.2200,
    status: "AVAILABLE",
    totalDonations: 11,
    gender: "Female",
    age: 29,
    verifiedMedical: true,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "donor-106",
    name: "Robert Taylor",
    bloodGroup: "O+",
    phone: "+91 98406 57762",
    reliabilityScore: 0.89,
    daysSinceLastDonation: 34, // Ineligible (<56 days)
    lat: 13.0850, // Anna Nagar
    lng: 80.2100,
    status: "AVAILABLE",
    totalDonations: 4,
    gender: "Male",
    age: 40,
    verifiedMedical: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "donor-107",
    name: "Priya Sharma",
    bloodGroup: "A-",
    phone: "+91 98407 36629",
    reliabilityScore: 0.93,
    daysSinceLastDonation: 80,
    lat: 13.0100, // Guindy
    lng: 80.2120,
    status: "AVAILABLE",
    totalDonations: 9,
    gender: "Female",
    age: 33,
    verifiedMedical: true,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "donor-108",
    name: "James Wilson",
    bloodGroup: "O-",
    phone: "+91 98408 91192",
    reliabilityScore: 0.88,
    daysSinceLastDonation: 59,
    lat: 13.0012, // Adyar
    lng: 80.2565,
    status: "AVAILABLE",
    totalDonations: 7,
    gender: "Male",
    age: 37,
    verifiedMedical: true,
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "donor-109",
    name: "Chloe Bennett",
    bloodGroup: "B-",
    phone: "+91 98409 65590",
    reliabilityScore: 0.95,
    daysSinceLastDonation: 90,
    lat: 13.0330, // Mylapore
    lng: 80.2680,
    status: "AVAILABLE",
    totalDonations: 12,
    gender: "Female",
    age: 27,
    verifiedMedical: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "donor-110",
    name: "Vikram Malhotra",
    bloodGroup: "AB+",
    phone: "+91 98410 12299",
    reliabilityScore: 0.86,
    daysSinceLastDonation: 140,
    lat: 13.0530, // Royapettah
    lng: 80.2610,
    status: "AVAILABLE",
    totalDonations: 5,
    gender: "Male",
    age: 35,
    verifiedMedical: true,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "donor-111",
    name: "Samantha Reed",
    bloodGroup: "O-",
    phone: "+91 98411 04101",
    reliabilityScore: 0.97,
    daysSinceLastDonation: 88,
    lat: 13.0500, // Vadapalani
    lng: 80.2120,
    status: "AVAILABLE",
    totalDonations: 16,
    gender: "Female",
    age: 30,
    verifiedMedical: true
  },
  {
    id: "donor-112",
    name: "Daniel Gomez",
    bloodGroup: "A+",
    phone: "+91 98412 13920",
    reliabilityScore: 0.91,
    daysSinceLastDonation: 62,
    lat: 13.0360, // Ashok Nagar
    lng: 80.2110,
    status: "AVAILABLE",
    totalDonations: 8,
    gender: "Male",
    age: 32,
    verifiedMedical: true
  },
  {
    id: "donor-113",
    name: "Maya Lin",
    bloodGroup: "O+",
    phone: "+91 98413 27711",
    reliabilityScore: 0.93,
    daysSinceLastDonation: 104,
    lat: 13.0220, // Saidapet
    lng: 80.2230,
    status: "AVAILABLE",
    totalDonations: 10,
    gender: "Female",
    age: 28,
    verifiedMedical: true
  },
  {
    id: "donor-114",
    name: "Alexander Wright",
    bloodGroup: "B+",
    phone: "+91 98414 38844",
    reliabilityScore: 0.85,
    daysSinceLastDonation: 22, // Ineligible (<56 days)
    lat: 13.0067, // Alandur
    lng: 80.2020,
    status: "AVAILABLE",
    totalDonations: 3,
    gender: "Male",
    age: 25,
    verifiedMedical: true
  },
  {
    id: "donor-115",
    name: "Zoe Kravitz",
    bloodGroup: "O-",
    phone: "+91 98415 49911",
    reliabilityScore: 0.99,
    daysSinceLastDonation: 150,
    lat: 12.9780, // Velachery
    lng: 80.2210,
    status: "AVAILABLE",
    totalDonations: 21,
    gender: "Female",
    age: 36,
    verifiedMedical: true
  },
  {
    id: "donor-116",
    name: "Tariq Mansoor",
    bloodGroup: "A-",
    phone: "+91 98416 11223",
    reliabilityScore: 0.87,
    daysSinceLastDonation: 75,
    lat: 13.0694, // Koyambedu
    lng: 80.1948,
    status: "AVAILABLE",
    totalDonations: 5,
    gender: "Male",
    age: 39,
    verifiedMedical: true
  },
  {
    id: "donor-117",
    name: "Emily Watson",
    bloodGroup: "AB+",
    phone: "+91 98417 33445",
    reliabilityScore: 0.90,
    daysSinceLastDonation: 92,
    lat: 13.0620, // Choolaimedu
    lng: 80.2200,
    status: "AVAILABLE",
    totalDonations: 7,
    gender: "Female",
    age: 31,
    verifiedMedical: true
  },
  {
    id: "donor-118",
    name: "Carlos Mendez",
    bloodGroup: "O-",
    phone: "+91 98418 55667",
    reliabilityScore: 0.94,
    daysSinceLastDonation: 61,
    lat: 13.0800, // Kilpauk
    lng: 80.2400,
    status: "AVAILABLE",
    totalDonations: 13,
    gender: "Male",
    age: 33,
    verifiedMedical: true
  },
  {
    id: "donor-119",
    name: "Hannah Abbott",
    bloodGroup: "A+",
    phone: "+91 98419 77889",
    reliabilityScore: 0.92,
    daysSinceLastDonation: 115,
    lat: 13.0580, // Triplicane
    lng: 80.2750,
    status: "AVAILABLE",
    totalDonations: 9,
    gender: "Female",
    age: 26,
    verifiedMedical: true
  },
  {
    id: "donor-120",
    name: "Gabriel Silva",
    bloodGroup: "B-",
    phone: "+91 98420 99001",
    reliabilityScore: 0.89,
    daysSinceLastDonation: 84,
    lat: 13.0900, // Purasawalkam
    lng: 80.2500,
    status: "AVAILABLE",
    totalDonations: 6,
    gender: "Male",
    age: 38,
    verifiedMedical: true
  },
  {
    id: "donor-121",
    name: "Jessica Park",
    bloodGroup: "O+",
    phone: "+91 98421 12345",
    reliabilityScore: 0.96,
    daysSinceLastDonation: 70,
    lat: 13.1200, // Tondiarpet
    lng: 80.2800,
    status: "AVAILABLE",
    totalDonations: 15,
    gender: "Female",
    age: 35,
    verifiedMedical: true
  },
  {
    id: "donor-122",
    name: "Karan Johar",
    bloodGroup: "O-",
    phone: "+91 98422 23456",
    reliabilityScore: 0.95,
    daysSinceLastDonation: 130,
    lat: 13.1050, // Royapuram
    lng: 80.2900,
    status: "AVAILABLE",
    totalDonations: 18,
    gender: "Male",
    age: 42,
    verifiedMedical: true
  },
  {
    id: "donor-123",
    name: "Laura Croft",
    bloodGroup: "A-",
    phone: "+91 98423 34567",
    reliabilityScore: 0.88,
    daysSinceLastDonation: 45, // Ineligible (<56 days)
    lat: 13.1100, // Perambur
    lng: 80.2400,
    status: "AVAILABLE",
    totalDonations: 4,
    gender: "Female",
    age: 29,
    verifiedMedical: true
  },
  {
    id: "donor-124",
    name: "Nathaniel Drake",
    bloodGroup: "B+",
    phone: "+91 98424 45678",
    reliabilityScore: 0.93,
    daysSinceLastDonation: 98,
    lat: 13.0720, // Aminjikarai
    lng: 80.2150,
    status: "AVAILABLE",
    totalDonations: 11,
    gender: "Male",
    age: 34,
    verifiedMedical: true
  },
  {
    id: "donor-125",
    name: "Olivia Wilde",
    bloodGroup: "AB-",
    phone: "+91 98425 56789",
    reliabilityScore: 0.97,
    daysSinceLastDonation: 82,
    lat: 12.9980, // Besant Nagar
    lng: 80.2680,
    status: "AVAILABLE",
    totalDonations: 12,
    gender: "Female",
    age: 32,
    verifiedMedical: true
  },
  {
    id: "donor-126",
    name: "Paul Atreides",
    bloodGroup: "O-",
    phone: "+91 98426 67890",
    reliabilityScore: 0.99,
    daysSinceLastDonation: 210,
    lat: 12.9830, // Thiruvanmiyur
    lng: 80.2590,
    status: "AVAILABLE",
    totalDonations: 25,
    gender: "Male",
    age: 27,
    verifiedMedical: true
  },
  {
    id: "donor-127",
    name: "Quinn Fabray",
    bloodGroup: "A+",
    phone: "+91 98427 78901",
    reliabilityScore: 0.86,
    daysSinceLastDonation: 77,
    lat: 13.0350, // Porur
    lng: 80.1580,
    status: "AVAILABLE",
    totalDonations: 5,
    gender: "Female",
    age: 24,
    verifiedMedical: true
  },
  {
    id: "donor-128",
    name: "Rohan Kapoor",
    bloodGroup: "B-",
    phone: "+91 98428 89012",
    reliabilityScore: 0.92,
    daysSinceLastDonation: 105,
    lat: 12.9010, // Sholinganallur
    lng: 80.2270,
    status: "AVAILABLE",
    totalDonations: 9,
    gender: "Male",
    age: 31,
    verifiedMedical: true
  },
  {
    id: "donor-129",
    name: "Sophia Martinez",
    bloodGroup: "O+",
    phone: "+91 98429 90123",
    reliabilityScore: 0.95,
    daysSinceLastDonation: 67,
    lat: 12.9229, // Tambaram
    lng: 80.1275,
    status: "AVAILABLE",
    totalDonations: 14,
    gender: "Female",
    age: 30,
    verifiedMedical: true
  },
  {
    id: "donor-130",
    name: "Tyler Durden",
    bloodGroup: "O-",
    phone: "+91 98430 01234",
    reliabilityScore: 0.91,
    daysSinceLastDonation: 89,
    lat: 13.0900, // George Town
    lng: 80.2850,
    status: "AVAILABLE",
    totalDonations: 8,
    gender: "Male",
    age: 36,
    verifiedMedical: true
  }
];
