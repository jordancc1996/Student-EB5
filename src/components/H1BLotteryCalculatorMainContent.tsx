import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ChevronDown, CheckCircle2, X, RefreshCw, ArrowRight, MapPin } from 'lucide-react';
import { ScheduleCallCTA } from '@/components/ScheduleCallCTA';

// --- DATA: JOB CONFIGURATION ---
interface SocOption {
  code: string;
  title: string;
  description: string;
  level: number;
  popular?: boolean;
}

interface JobData {
  title: string;
  socOptions: SocOption[];
  isCustom?: boolean;
}

const getGenericSocOptions = (jobTitle: string, defaultLevel = 2): SocOption[] => [
  { code: "15-1252.00", title: `${jobTitle}s (General)`, description: `Standard classification for ${jobTitle} roles involving core responsibilities typical to the industry.`, level: defaultLevel, popular: true },
  { code: "15-1299.00", title: "Occupations, All Other", description: `Roles that do not fit into specific detailed occupations but are distinct.`, level: Math.max(1, defaultLevel - 1) },
  { code: "11-1021.00", title: "General and Operations Managers", description: "Plan, direct, or coordinate the operations of public or private sector organizations.", level: 4 }
];

const JOB_DATA: JobData[] = [
  // Tech
  { title: "Software Engineer", socOptions: getGenericSocOptions("Software Engineer", 2) },
  { title: "Data Scientist", socOptions: [{ code: "15-2051.00", title: "Data Scientists", description: "Develop and implement a set of techniques or analytics applications to transform raw data.", level: 2, popular: true }, { code: "15-2041.00", title: "Statisticians", description: "Develop or apply mathematical or statistical theory.", level: 2 }, { code: "15-1211.00", title: "Computer Systems Analysts", description: "Analyze science, engineering, business, and other data processing problems.", level: 1 }] },
  { title: "Product Manager", socOptions: getGenericSocOptions("Product Manager", 3) },
  { title: "Software Developer", socOptions: getGenericSocOptions("Software Developer", 2) },
  { title: "Full Stack Engineer", socOptions: getGenericSocOptions("Full Stack Engineer", 2) },
  { title: "Frontend Engineer", socOptions: getGenericSocOptions("Frontend Engineer", 2) },
  { title: "Backend Engineer", socOptions: getGenericSocOptions("Backend Engineer", 2) },
  { title: "DevOps Engineer", socOptions: getGenericSocOptions("DevOps Engineer", 3) },
  { title: "Data Engineer", socOptions: getGenericSocOptions("Data Engineer", 2) },
  { title: "Machine Learning Engineer", socOptions: getGenericSocOptions("Machine Learning Engineer", 3) },
  { title: "AI Engineer", socOptions: getGenericSocOptions("AI Engineer", 3) },
  { title: "Solution Architect", socOptions: getGenericSocOptions("Solution Architect", 4) },
  { title: "Systems Engineer", socOptions: getGenericSocOptions("Systems Engineer", 2) },
  { title: "Cloud Engineer", socOptions: getGenericSocOptions("Cloud Engineer", 3) },
  // Executive
  { title: "Chief Executive Officer (CEO)", socOptions: getGenericSocOptions("Chief Executive", 4) },
  { title: "Chief Technology Officer (CTO)", socOptions: getGenericSocOptions("Chief Executive", 4) },
  { title: "Chief of Staff", socOptions: getGenericSocOptions("Chief of Staff", 3) },
  { title: "Head of Operations", socOptions: [{ code: "11-1021.00", title: "General and Operations Managers", description: "Plan, direct, or coordinate the operations of public or private sector organizations.", level: 4, popular: true }, { code: "11-3051.00", title: "Industrial Production Managers", description: "Plan, direct, or coordinate work activities.", level: 3 }, { code: "11-3071.00", title: "Transportation Managers", description: "Plan, direct, or coordinate transportation activities.", level: 3 }] },
  { title: "Operations Manager", socOptions: getGenericSocOptions("Operations Manager", 3) },
  { title: "Project Manager", socOptions: getGenericSocOptions("Project Manager", 2) },
  { title: "Business Analyst", socOptions: getGenericSocOptions("Business Analyst", 1) },
  { title: "Management Consultant", socOptions: getGenericSocOptions("Management Consultant", 3) },
  // Finance/Marketing
  { title: "Financial Analyst", socOptions: getGenericSocOptions("Financial Analyst", 1) },
  { title: "Accountant", socOptions: getGenericSocOptions("Accountant", 1) },
  { title: "Investment Banker", socOptions: getGenericSocOptions("Financial Specialist", 4) },
  { title: "Marketing Manager", socOptions: getGenericSocOptions("Marketing Manager", 3) },
  { title: "Product Marketing Manager", socOptions: getGenericSocOptions("Product Marketing Manager", 3) },
  { title: "Digital Marketing Specialist", socOptions: getGenericSocOptions("Digital Marketing Specialist", 2) },
  // Engineering (Non-SW)
  { title: "Mechanical Engineer", socOptions: getGenericSocOptions("Mechanical Engineer", 2) },
  { title: "Electrical Engineer", socOptions: getGenericSocOptions("Electrical Engineer", 2) },
  { title: "Civil Engineer", socOptions: getGenericSocOptions("Civil Engineer", 2) },
  { title: "Industrial Engineer", socOptions: getGenericSocOptions("Industrial Engineer", 2) },
  { title: "Biomedical Engineer", socOptions: getGenericSocOptions("Biomedical Engineer", 2) },
  { title: "Chemical Engineer", socOptions: getGenericSocOptions("Chemical Engineer", 2) },
  // Health/Science
  { title: "Medical Scientist", socOptions: getGenericSocOptions("Medical Scientist", 3) },
  { title: "Pharmacist", socOptions: getGenericSocOptions("Pharmacist", 3) },
  { title: "Physician", socOptions: getGenericSocOptions("Physician", 4) },
  { title: "Researcher", socOptions: getGenericSocOptions("Researcher", 2) },
];

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const COUNTIES: Record<string, string[]> = {
  "Alabama": ["Jefferson", "Mobile", "Madison", "Montgomery", "Shelby", "Tuscaloosa", "Baldwin", "Lee", "Morgan", "Calhoun", "Etowah", "Houston", "Marshall", "Lauderdale", "St. Clair", "Limestone", "Talladega", "Cullman", "Elmore", "DeKalb"],
  "Alaska": ["Anchorage", "Fairbanks North Star", "Matanuska-Susitna", "Kenai Peninsula", "Juneau", "Bethel", "Ketchikan Gateway", "Kodiak Island", "North Slope", "Valdez-Cordova"],
  "Arizona": ["Maricopa", "Pima", "Pinal", "Yavapai", "Mohave", "Yuma", "Coconino", "Cochise", "Navajo", "Apache", "Gila", "Santa Cruz", "Graham", "La Paz", "Greenlee"],
  "Arkansas": ["Pulaski", "Benton", "Washington", "Sebastian", "Faulkner", "Saline", "Craighead", "Garland", "White", "Jefferson", "Lonoke", "Crawford", "Pope", "Crittenden", "Baxter", "Miller", "Boone", "Union", "Independence", "Greene"],
  "California": ["Los Angeles", "San Diego", "Orange", "Riverside", "San Bernardino", "Santa Clara", "Alameda", "Sacramento", "Contra Costa", "Fresno", "Kern", "San Francisco", "Ventura", "San Mateo", "San Joaquin", "Stanislaus", "Sonoma", "Tulare", "Solano", "Monterey", "Santa Barbara", "Placer", "San Luis Obispo", "Santa Cruz", "Merced", "Marin", "Butte", "Yolo", "El Dorado", "Shasta"],
  "Colorado": ["Denver", "El Paso", "Arapahoe", "Jefferson", "Adams", "Larimer", "Douglas", "Boulder", "Weld", "Pueblo", "Mesa", "Broomfield", "Garfield", "La Plata", "Eagle", "Fremont", "Montrose", "Summit", "Morgan", "Elbert"],
  "Connecticut": ["Fairfield", "Hartford", "New Haven", "New London", "Litchfield", "Middlesex", "Tolland", "Windham"],
  "Delaware": ["New Castle", "Sussex", "Kent"],
  "District of Columbia": ["Washington"],
  "Florida": ["Miami-Dade", "Broward", "Palm Beach", "Hillsborough", "Orange", "Duval", "Pinellas", "Lee", "Polk", "Brevard", "Volusia", "Pasco", "Seminole", "Sarasota", "Manatee", "Collier", "Marion", "Osceola", "Lake", "Escambia", "St. Lucie", "Leon", "Alachua", "St. Johns", "Clay", "Okaloosa", "Hernando", "Bay", "Charlotte", "Santa Rosa"],
  "Georgia": ["Fulton", "Gwinnett", "Cobb", "DeKalb", "Chatham", "Clayton", "Cherokee", "Forsyth", "Henry", "Richmond", "Muscogee", "Hall", "Bibb", "Houston", "Paulding", "Douglas", "Columbia", "Lowndes", "Carroll", "Coweta", "Clarke", "Fayette", "Whitfield", "Newton", "Bartow", "Floyd", "Walton", "Rockdale", "Dougherty", "Glynn"],
  "Hawaii": ["Honolulu", "Hawaii", "Maui", "Kauai", "Kalawao"],
  "Idaho": ["Ada", "Canyon", "Kootenai", "Bonneville", "Bannock", "Twin Falls", "Bingham", "Bonner", "Nez Perce", "Latah", "Madison", "Payette", "Elmore", "Jefferson", "Cassia", "Jerome", "Blaine", "Minidoka", "Gem", "Idaho"],
  "Illinois": ["Cook", "DuPage", "Lake", "Will", "Kane", "McHenry", "Winnebago", "Madison", "St. Clair", "Champaign", "Sangamon", "Peoria", "McLean", "Rock Island", "Tazewell", "Kendall", "LaSalle", "Kankakee", "Macon", "DeKalb", "Vermilion", "Adams", "Whiteside", "Williamson", "Jackson", "Boone", "Coles", "Ogle", "Knox", "Grundy"],
  "Indiana": ["Marion", "Lake", "Allen", "Hamilton", "St. Joseph", "Elkhart", "Tippecanoe", "Vanderburgh", "Porter", "Hendricks", "Johnson", "Monroe", "Madison", "Delaware", "Clark", "LaPorte", "Vigo", "Howard", "Bartholomew", "Kosciusko", "Floyd", "Hancock", "Morgan", "Grant", "Wayne", "Warrick", "Boone", "Henry", "Dearborn", "Noble"],
  "Iowa": ["Polk", "Linn", "Scott", "Johnson", "Black Hawk", "Woodbury", "Dubuque", "Story", "Pottawattamie", "Dallas", "Clinton", "Warren", "Cerro Gordo", "Muscatine", "Marshall", "Des Moines", "Jasper", "Webster", "Sioux", "Lee"],
  "Kansas": ["Johnson", "Sedgwick", "Shawnee", "Wyandotte", "Douglas", "Leavenworth", "Riley", "Butler", "Reno", "Saline", "Crawford", "Finney", "Cowley", "Harvey", "Ford", "Miami", "Montgomery", "McPherson", "Lyon", "Barton"],
  "Kentucky": ["Jefferson", "Fayette", "Kenton", "Boone", "Warren", "Hardin", "Daviess", "Campbell", "Madison", "Bullitt", "Christian", "McCracken", "Oldham", "Pulaski", "Laurel", "Pike", "Shelby", "Scott", "Boyd", "Jessamine", "Franklin", "Henderson", "Hopkins", "Barren", "Calloway", "Graves", "Whitley", "Nelson", "Greenup", "Floyd"],
  "Louisiana": ["East Baton Rouge", "Jefferson", "Orleans", "Caddo", "St. Tammany", "Lafayette", "Calcasieu", "Ouachita", "Livingston", "Tangipahoa", "Bossier", "Ascension", "Rapides", "Terrebonne", "Lafourche", "St. Landry", "Iberia", "Acadia", "Vermilion", "St. Mary", "St. Charles", "St. Martin", "Vernon", "Washington", "Lincoln", "St. Bernard", "Avoyelles", "Webster", "Assumption", "Morehouse"],
  "Maine": ["Cumberland", "York", "Penobscot", "Kennebec", "Androscoggin", "Aroostook", "Oxford", "Hancock", "Somerset", "Knox", "Waldo", "Sagadahoc", "Lincoln", "Washington", "Franklin", "Piscataquis"],
  "Maryland": ["Montgomery", "Prince George's", "Baltimore", "Baltimore City", "Anne Arundel", "Howard", "Frederick", "Harford", "Carroll", "Charles", "Washington", "St. Mary's", "Cecil", "Wicomico", "Calvert", "Allegany", "Worcester", "Queen Anne's", "Talbot", "Dorchester"],
  "Massachusetts": ["Middlesex", "Worcester", "Essex", "Suffolk", "Norfolk", "Bristol", "Plymouth", "Hampden", "Barnstable", "Hampshire", "Berkshire", "Franklin", "Dukes", "Nantucket"],
  "Michigan": ["Wayne", "Oakland", "Macomb", "Kent", "Genesee", "Washtenaw", "Ingham", "Ottawa", "Kalamazoo", "Saginaw", "Livingston", "Muskegon", "St. Clair", "Jackson", "Berrien", "Monroe", "Calhoun", "Allegan", "Eaton", "Bay", "Lenawee", "Grand Traverse", "Lapeer", "Midland", "Clinton", "Van Buren", "Shiawassee", "Isabella", "Montcalm", "Marquette"],
  "Minnesota": ["Hennepin", "Ramsey", "Dakota", "Anoka", "Washington", "St. Louis", "Olmsted", "Stearns", "Scott", "Wright", "Sherburne", "Carver", "Blue Earth", "Rice", "Crow Wing", "Clay", "Otter Tail", "Chisago", "Winona", "Itasca", "Goodhue", "Beltrami", "Kandiyohi", "Benton", "Mower", "Steele", "Isanti", "Douglas", "Morrison", "Freeborn"],
  "Mississippi": ["Hinds", "Harrison", "DeSoto", "Rankin", "Jackson", "Madison", "Lee", "Forrest", "Lauderdale", "Jones", "Pearl River", "Lowndes", "Washington", "Warren", "Lamar", "Pike", "Lafayette", "Octibbeha", "Monroe", "Bolivar"],
  "Missouri": ["St. Louis", "Jackson", "St. Charles", "St. Louis City", "Greene", "Clay", "Jefferson", "Boone", "Jasper", "Franklin", "Cass", "Buchanan", "Platte", "Christian", "Cole", "Cape Girardeau", "St. Francois", "Newton", "Pettis", "Pulaski"],
  "Montana": ["Yellowstone", "Missoula", "Gallatin", "Flathead", "Cascade", "Lewis and Clark", "Ravalli", "Silver Bow", "Lake", "Lincoln"],
  "Nebraska": ["Douglas", "Lancaster", "Sarpy", "Hall", "Buffalo", "Dodge", "Scotts Bluff", "Madison", "Platte", "Lincoln"],
  "Nevada": ["Clark", "Washoe", "Carson City", "Lyon", "Elko", "Douglas", "Nye", "Churchill", "Humboldt", "White Pine"],
  "New Hampshire": ["Hillsborough", "Rockingham", "Merrimack", "Strafford", "Grafton", "Cheshire", "Belknap", "Carroll", "Sullivan", "Coos"],
  "New Jersey": ["Bergen", "Middlesex", "Essex", "Hudson", "Monmouth", "Ocean", "Union", "Camden", "Passaic", "Morris", "Burlington", "Mercer", "Somerset", "Gloucester", "Atlantic", "Cumberland", "Sussex", "Hunterdon", "Warren", "Cape May", "Salem"],
  "New Mexico": ["Bernalillo", "Doña Ana", "Santa Fe", "Sandoval", "San Juan", "Valencia", "McKinley", "Lea", "Otero", "Chaves", "Eddy", "Curry", "Rio Arriba", "Taos", "Cibola"],
  "New York": ["Kings (Brooklyn)", "Queens", "New York (Manhattan)", "Suffolk", "Bronx", "Nassau", "Westchester", "Erie", "Monroe", "Richmond (Staten Island)", "Onondaga", "Orange", "Rockland", "Albany", "Dutchess", "Oneida", "Saratoga", "Niagara", "Broome", "Ulster", "Rensselaer", "Schenectady", "Chautauqua", "Oswego", "Jefferson", "St. Lawrence", "Ontario", "Tompkins", "Putnam", "Steuben"],
  "North Carolina": ["Wake", "Mecklenburg", "Guilford", "Forsyth", "Cumberland", "Durham", "Buncombe", "Union", "New Hanover", "Gaston", "Cabarrus", "Johnston", "Onslow", "Iredell", "Alamance", "Davidson", "Catawba", "Orange", "Randolph", "Pitt", "Harnett", "Robeson", "Wayne", "Rowan", "Brunswick", "Henderson", "Craven", "Lincoln", "Moore", "Surry"],
  "North Dakota": ["Cass", "Burleigh", "Grand Forks", "Ward", "Morton", "Stark", "Williams", "Stutsman", "Richland", "Rolette"],
  "Ohio": ["Franklin", "Cuyahoga", "Hamilton", "Summit", "Montgomery", "Lucas", "Butler", "Stark", "Lorain", "Warren", "Lake", "Mahoning", "Delaware", "Trumbull", "Clermont", "Medina", "Licking", "Greene", "Portage", "Fairfield", "Clark", "Wood", "Richland", "Wayne", "Columbiana", "Allen", "Miami", "Ashtabula", "Geauga", "Tuscarawas"],
  "Oklahoma": ["Oklahoma", "Tulsa", "Cleveland", "Canadian", "Comanche", "Rogers", "Payne", "Wagoner", "Muskogee", "Creek", "Pottawatomie", "Garfield", "Grady", "Washington", "Le Flore", "Carter", "Cherokee", "Osage", "Kay", "Stephens"],
  "Oregon": ["Multnomah", "Washington", "Clackamas", "Lane", "Marion", "Jackson", "Deschutes", "Linn", "Douglas", "Yamhill", "Benton", "Josephine", "Polk", "Umatilla", "Klamath", "Coos", "Columbia", "Lincoln", "Clatsop", "Malheur"],
  "Pennsylvania": ["Philadelphia", "Allegheny", "Montgomery", "Bucks", "Delaware", "Lancaster", "Chester", "York", "Berks", "Lehigh", "Westmoreland", "Luzerne", "Northampton", "Dauphin", "Erie", "Cumberland", "Lackawanna", "Washington", "Butler", "Beaver", "Monroe", "Franklin", "Centre", "Lebanon", "Schuylkill", "Cambria", "Fayette", "Blair", "Lycoming", "Mercer"],
  "Rhode Island": ["Providence", "Kent", "Washington", "Newport", "Bristol"],
  "South Carolina": ["Greenville", "Richland", "Charleston", "Horry", "Spartanburg", "Lexington", "York", "Anderson", "Berkeley", "Aiken", "Florence", "Pickens", "Dorchester", "Sumter", "Beaufort", "Orangeburg", "Oconee", "Lancaster", "Greenwood", "Laurens"],
  "South Dakota": ["Minnehaha", "Pennington", "Lincoln", "Brown", "Brookings", "Codington", "Meade", "Lawrence", "Yankton", "Davison"],
  "Tennessee": ["Shelby", "Davidson", "Knox", "Hamilton", "Rutherford", "Williamson", "Montgomery", "Sumner", "Sullivan", "Wilson", "Blount", "Washington", "Bradley", "Madison", "Sevier", "Maury", "Anderson", "Putnam", "Greene", "Robertson", "Hamblen", "Tipton", "Cumberland", "Morgan", "Hawkins", "Coffee", "Jefferson", "Gibson", "Roane", "Bedford"],
  "Texas": ["Harris", "Dallas", "Tarrant", "Bexar", "Travis", "Collin", "Denton", "Hidalgo", "El Paso", "Fort Bend", "Montgomery", "Williamson", "Cameron", "Nueces", "Brazoria", "Bell", "Galveston", "Lubbock", "Jefferson", "Webb", "McLennan", "Smith", "Brazos", "Hays", "Johnson", "Ellis", "Midland", "Ector", "Guadalupe", "Taylor", "Wichita", "Parker", "Gregg", "Potter", "Grayson", "Randall", "Kaufman", "Tom Green", "Comal", "Victoria"],
  "Utah": ["Salt Lake", "Utah", "Davis", "Weber", "Washington", "Cache", "Tooele", "Box Elder", "Iron", "Summit"],
  "Vermont": ["Chittenden", "Rutland", "Washington", "Windsor", "Franklin", "Windham", "Addison", "Bennington", "Caledonia", "Orange"],
  "Virginia": ["Fairfax", "Prince William", "Virginia Beach", "Loudoun", "Chesterfield", "Henrico", "Norfolk", "Chesapeake", "Arlington", "Richmond", "Newport News", "Alexandria", "Hampton", "Stafford", "Spotsylvania", "Albemarle", "Hanover", "Roanoke", "Portsmouth", "Montgomery", "Suffolk", "Frederick", "Rockingham", "Lynchburg", "Bedford", "Augusta", "James City", "Fauquier", "York", "Pittsylvania"],
  "Washington": ["King", "Pierce", "Snohomish", "Spokane", "Clark", "Thurston", "Kitsap", "Yakima", "Whatcom", "Benton", "Skagit", "Cowlitz", "Grant", "Franklin", "Island", "Lewis", "Grays Harbor", "Chelan", "Clallam", "Mason"],
  "West Virginia": ["Kanawha", "Berkeley", "Monongalia", "Cabell", "Wood", "Raleigh", "Harrison", "Mercer", "Marion", "Putnam", "Jefferson", "Fayette", "Ohio", "Wayne", "Preston"],
  "Wisconsin": ["Milwaukee", "Dane", "Waukesha", "Brown", "Racine", "Outagamie", "Winnebago", "Kenosha", "Rock", "Marathon", "Washington", "La Crosse", "Sheboygan", "Eau Claire", "Fond du Lac", "Walworth", "St. Croix", "Dodge", "Ozaukee", "Jefferson", "Manitowoc", "Wood", "Portage", "Chippewa", "Sauk", "Columbia", "Waupaca", "Grant", "Calumet", "Barron"],
  "Wyoming": ["Laramie", "Natrona", "Campbell", "Sweetwater", "Fremont", "Albany", "Sheridan", "Park", "Teton", "Uinta"]
};

const H1BLotteryCalculatorMainContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [selectedSoc, setSelectedSoc] = useState<SocOption | null>(null);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');

  const [isJobDropdownOpen, setIsJobDropdownOpen] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isCountyDropdownOpen, setIsCountyDropdownOpen] = useState(false);
  
  const jobWrapperRef = useRef<HTMLDivElement>(null);
  const stateWrapperRef = useRef<HTMLDivElement>(null);
  const countyWrapperRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // --- FILTER LOGIC ---
  const visibleJobs = useMemo(() => {
    if (!searchTerm) return JOB_DATA;
    const lowerTerm = searchTerm.toLowerCase();
    const matches = JOB_DATA.filter(job => job.title.toLowerCase().includes(lowerTerm));
    if (matches.length === 0 && searchTerm.length > 1) {
      return [{ title: searchTerm, socOptions: getGenericSocOptions(searchTerm, 2), isCustom: true }];
    }
    return matches;
  }, [searchTerm]);

  const visibleCounties = useMemo(() => COUNTIES[selectedState] || [], [selectedState]);

  const handleJobSelect = (job: JobData) => {
    setSelectedJob(job);
    setSearchTerm(job.title);
    setIsJobDropdownOpen(false);
    setSelectedSoc(null); 
    setSelectedState('');
    setSelectedCounty('');
  };

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    setIsStateDropdownOpen(false);
    setSelectedCounty(''); 
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (jobWrapperRef.current && !jobWrapperRef.current.contains(event.target as Node)) setIsJobDropdownOpen(false);
      if (stateWrapperRef.current && !stateWrapperRef.current.contains(event.target as Node)) setIsStateDropdownOpen(false);
      if (countyWrapperRef.current && !countyWrapperRef.current.contains(event.target as Node)) setIsCountyDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Smooth scroll to results when completed
  useEffect(() => {
    if (selectedCounty && resultsRef.current) {
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    }
  }, [selectedCounty]);

  // --- MAIN CALCULATION ENGINE ---
  const results = useMemo((): ResultRow[] | null => {
    if (!selectedSoc || !selectedState || !selectedCounty) return null;

    const BASE_REGISTRATIONS = 343000;
    const totalRegistrations = BASE_REGISTRATIONS * 0.75; // Fixed at 75% (moderate projection)
    const totalSelectionsNeeded = 120141; 
    
    const dist = { L1: 0.40, L2: 0.42, L3: 0.11, L4: 0.07 };
    const countL1 = totalRegistrations * dist.L1;
    const countL2 = totalRegistrations * dist.L2;
    const countL3 = totalRegistrations * dist.L3;
    const countL4 = totalRegistrations * dist.L4;
    
    const totalTickets = (countL1 * 1) + (countL2 * 2) + (countL3 * 3) + (countL4 * 4);
    const f = totalSelectionsNeeded / totalTickets;

    const getOdds = (level: number) => {
      const odds = 1 - Math.pow((1 - f), level);
      return (odds * 100).toFixed(1) + "%";
    };

    const baseWage = 64000; 
    const gap = 14000;
    
    return [
      { level: 1, salary: `$${(baseWage).toLocaleString()} - $${(baseWage + gap).toLocaleString()}`, odds: getOdds(1), tickets: "1 ticket" },
      { level: 2, salary: `$${(baseWage + gap + 1).toLocaleString()} - $${(baseWage + (gap*2)).toLocaleString()}`, odds: getOdds(2), tickets: "2 tickets" },
      { level: 3, salary: `$${(baseWage + (gap*2) + 1).toLocaleString()} - $${(baseWage + (gap*3)).toLocaleString()}`, odds: getOdds(3), tickets: "3 tickets" },
      { level: 4, salary: `$${(baseWage + (gap*3) + 1).toLocaleString()}+`, odds: getOdds(4), tickets: "4 tickets" },
    ];
  }, [selectedSoc, selectedState, selectedCounty]);

  const userOddsLow = useMemo(() => {
    if (!results || !selectedSoc) return false;
    const userLevel = selectedSoc.level;
    const row = results.find(r => r.level === userLevel);
    if (!row) return false;
    return parseFloat(row.odds) < 30;
  }, [results, selectedSoc]);

  const resetAll = () => {
    setSearchTerm('');
    setSelectedJob(null);
    setSelectedSoc(null);
    setSelectedState('');
    setSelectedCounty('');
  };

  return (
    <>
          <div className="max-w-7xl mx-auto mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: Steps */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* STEP 1: JOB */}
                <div className={`bg-card p-6 rounded-2xl shadow-soft border ${selectedJob ? 'border-foreground/30 ring-1 ring-foreground/10' : 'border-border'} relative z-30 transition-all duration-300`} ref={jobWrapperRef}>
                  <label className="flex items-center space-x-3 text-lg font-medium text-foreground mb-4">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${selectedJob ? 'bg-foreground text-background' : 'bg-muted text-foreground'}`}>1</span>
                    <span>Select Job Title</span>
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="e.g. Software Engineer"
                      className="w-full pl-12 pr-10 py-3 rounded-xl border border-input bg-background focus:border-foreground focus:ring-2 focus:ring-foreground/10 outline-none text-foreground text-lg"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsJobDropdownOpen(true);
                        setSelectedJob(null);
                        setSelectedSoc(null);
                      }}
                      onFocus={() => setIsJobDropdownOpen(true)}
                    />
                    {searchTerm && (
                      <button onClick={() => { setSearchTerm(''); setIsJobDropdownOpen(true); setSelectedJob(null); }} className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    {isJobDropdownOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-card rounded-xl shadow-medium border border-border max-h-60 overflow-y-auto ring-1 ring-foreground/5">
                        {visibleJobs.map((job, idx) => (
                          <button key={idx} className="w-full text-left px-6 py-3 hover:bg-muted transition-colors flex justify-between items-center group border-b border-border/50 last:border-0" onClick={() => handleJobSelect(job)}>
                            <span className="text-foreground font-medium group-hover:text-foreground">{job.title}</span>
                            {selectedJob?.title === job.title && <CheckCircle2 className="w-4 h-4 text-foreground" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* STEP 2: SOC */}
                {selectedJob && (
                  <div className="bg-card p-6 rounded-2xl shadow-soft border border-border">
                    <label className="flex items-center space-x-3 text-lg font-medium text-foreground mb-4">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${selectedSoc ? 'bg-foreground text-background' : 'bg-muted text-foreground'}`}>2</span>
                      <span>Select SOC Code</span>
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedJob.socOptions.map((soc, idx) => (
                        <button key={idx} onClick={() => { setSelectedSoc(soc); setSelectedState(''); }} className={`relative text-left p-4 rounded-xl border transition-all hover:border-foreground/40 flex flex-col ${selectedSoc?.code === soc.code ? 'border-foreground bg-muted' : 'border-border bg-card'}`}>
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-mono text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">{soc.code}</span>
                            {soc.popular && <span className="bg-foreground/10 text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">COMMON</span>}
                          </div>
                          <div className="font-bold text-foreground text-sm mb-1">{soc.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">{soc.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: LOCATION */}
                {selectedSoc && (
                  <div className="bg-card p-6 rounded-2xl shadow-soft border border-border z-20 relative">
                    <label className="flex items-center space-x-3 text-lg font-medium text-foreground mb-4">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${selectedState && selectedCounty ? 'bg-foreground text-background' : 'bg-muted text-foreground'}`}>3</span>
                      <span>Select Location</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative" ref={stateWrapperRef}>
                        <button className="w-full text-left bg-card border border-border text-foreground text-base rounded-xl px-4 py-3 flex justify-between items-center hover:border-foreground/40" onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}>
                          {selectedState || "Select State"} <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        </button>
                        {isStateDropdownOpen && (
                          <div className="absolute z-40 w-full mt-2 bg-card rounded-xl shadow-medium border border-border max-h-60 overflow-y-auto">
                            {US_STATES.map((state) => (
                              <button key={state} className="w-full text-left px-4 py-2 hover:bg-muted text-foreground text-sm" onClick={() => handleStateSelect(state)}>{state}</button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="relative" ref={countyWrapperRef}>
                        {visibleCounties.length > 0 ? (
                          <>
                            <button className={`w-full text-left border text-base rounded-xl px-4 py-3 flex justify-between items-center ${selectedState ? 'bg-card border-border hover:border-foreground/40' : 'bg-muted text-muted-foreground'}`} disabled={!selectedState} onClick={() => setIsCountyDropdownOpen(!isCountyDropdownOpen)}>
                              {selectedCounty || (selectedState ? "Select County" : "...")} <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            </button>
                            {isCountyDropdownOpen && selectedState && (
                              <div className="absolute z-40 w-full mt-2 bg-card rounded-xl shadow-medium border border-border max-h-60 overflow-y-auto">
                                {visibleCounties.map((c, idx) => (
                                  <button key={idx} className="w-full text-left px-4 py-2 hover:bg-muted text-foreground text-sm" onClick={() => { setSelectedCounty(c); setIsCountyDropdownOpen(false); }}>{c} County</button>
                                ))}
                                <button className="w-full text-left px-4 py-2 hover:bg-muted text-muted-foreground text-sm italic border-t border-border" onClick={() => { const c = prompt("Enter County:"); if(c) setSelectedCounty(c); setIsCountyDropdownOpen(false); }}>Other...</button>
                              </div>
                            )}
                          </>
                        ) : (
                          <input type="text" disabled={!selectedState} placeholder="Enter County..." className="w-full bg-card border border-border text-foreground text-base rounded-xl px-4 py-3 disabled:bg-muted" value={selectedCounty} onChange={(e) => setSelectedCounty(e.target.value)} />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Results Dashboard */}
              <div className="lg:col-span-7 space-y-6" ref={resultsRef}>
                {selectedCounty && results ? (
                  <>
                    {/* 1. Summary Card */}
                    <div className="bg-card rounded-2xl p-8 border border-border shadow-soft">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Selected Position</div>
                          <h2 className="text-3xl font-serif text-foreground mb-2">{selectedSoc.title}</h2>
                          <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">{selectedSoc.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 border-t border-border pt-6">
                        <div>
                          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">SOC Code</div>
                          <div className="font-mono text-sm bg-muted px-2 py-1 rounded text-foreground">{selectedSoc.code}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Location</div>
                          <div className="font-medium text-sm text-foreground flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> {selectedCounty}, {selectedState}</div>
                        </div>
                      </div>
                    </div>

                    {/* 2. THE TABLE */}
                    <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
                      <div className="grid grid-cols-4 bg-muted border-b border-border px-6 py-4">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Wage Level</div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Yearly Salary</div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Selection Odds</div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Lottery Tickets</div>
                      </div>
                      <div className="divide-y divide-border">
                        {results.map((row) => (
                          <div key={row.level} className={`grid grid-cols-4 px-6 py-5 items-center ${row.level === selectedSoc?.level ? 'bg-muted/50' : ''}`}>
                            <div className="font-medium text-foreground">Level {row.level}</div>
                            <div className="text-sm text-muted-foreground">{row.salary}</div>
                            <div className="text-right font-bold text-foreground text-lg">{row.odds}</div>
                            <div className="text-right text-sm text-muted-foreground">{row.tickets}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reset Button */}
                    <button onClick={resetAll} className="w-full py-4 border border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors flex justify-center items-center gap-2 font-medium">
                      <RefreshCw className="w-4 h-4" /> Reset Calculator
                    </button>
                  </>
                ) : (
                  // Empty State / Instructions
                  <div className="h-full flex flex-col justify-center items-center p-8 text-center text-muted-foreground border-2 border-dashed border-border rounded-3xl min-h-[400px]">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4"><ArrowRight className="w-5 h-5" /></div>
                    <p className="max-w-xs">Complete the steps on the left to generate your personalized H-1B odds dashboard.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Methodology Section - Shows after results */}
            {selectedCounty && results && (
              <div className="mt-16 pb-8">
                <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-2">
                  How We Calculate<br />
                  <span className="italic font-light">Your Lottery Odds</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
                  Here are our assumptions. Many of the numbers are based on lottery data from last year (FY2026), adjusted for the new wage-weighted selection system:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1: Total Registrations */}
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
                    <div className="text-sm text-muted-foreground mb-2">1</div>
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-3">Total Registrations</h3>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                      Last year's lottery (FY2026) had 343,000 registrations. The new $100,000 consular processing fee only affects applicants filing from outside the U.S.
                    </p>
                    <div className="text-4xl font-serif text-foreground mb-1">343,000</div>
                    <div className="text-xs text-muted-foreground mb-6">FY2025 baseline registrations</div>
                    
                    <div className="border-t border-border pt-4">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Expected Breakdown</div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-foreground">~171,500 consular processing</span>
                          <div className="text-muted-foreground text-xs">affected by $100k fee</div>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">~171,500 status change filings</span>
                          <div className="text-muted-foreground text-xs">not affected</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Wage Level Distribution */}
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
                    <div className="text-sm text-muted-foreground mb-2">2</div>
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-3">Wage Level Distribution</h3>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                      How registrations are distributed across wage levels, based on last year's data.
                    </p>
                    
                    <div className="space-y-4">
                      {[
                        { level: 1, pct: 40, entries: 1 },
                        { level: 2, pct: 42, entries: 2 },
                        { level: 3, pct: 11, entries: 3 },
                        { level: 4, pct: 7, entries: 4 },
                      ].map((item) => (
                        <div key={item.level} className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-muted-foreground">Wage</div>
                            <div className="font-medium text-foreground">Level {item.level}</div>
                          </div>
                          <div className="flex-1 mx-4">
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-foreground/30 rounded-full" 
                                style={{ width: `${item.pct}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-foreground">{item.pct}% of registrations</div>
                            <div className="text-xs text-muted-foreground">{item.entries} {item.entries === 1 ? 'entry' : 'entries'} per person</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 3: Total Ticket Pool */}
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
                    <div className="text-sm text-muted-foreground mb-2">3</div>
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-3">Total Ticket Pool</h3>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                      All lottery entries are combined into a single pool. Since higher wage levels receive multiple entries per registration, the total ticket pool is larger than the number of registrations.
                    </p>
                    
                    <div className="bg-muted rounded-xl p-4 mb-4">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Formula</div>
                      <div className="font-mono text-sm text-foreground leading-relaxed">
                        Total Tickets = (WL1 × 1) + (WL2 × 2) + (WL3 × 3) + (WL4 × 4)
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      where <span className="font-mono bg-muted px-1 rounded">WL1</span> - <span className="font-mono bg-muted px-1 rounded">WL4</span> are the number of registrations at each wage level
                    </p>
                  </div>

                  {/* Card 4: Selection Probability Formula */}
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
                    <div className="text-sm text-muted-foreground mb-2">4</div>
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-3">Selection Probability Formula</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      Based on last year's data, USCIS needs to select approximately 120,141 unique people to fill the 85,000 available H-1B visas (accounting for denials and withdrawals).
                    </p>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                      Since higher wage levels have multiple tickets, USCIS must draw more tickets than selections to reach the target.
                    </p>
                    
                    <div className="bg-muted rounded-xl p-4 mb-4">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Formula</div>
                      <div className="font-mono text-lg text-foreground">
                        P(selected) = 1 - (1 - f)<sup>w</sup>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-start gap-2">
                        <span className="font-mono bg-muted px-1 rounded text-foreground">f</span>
                        <span>= per-ticket probability</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-mono bg-muted px-1 rounded text-foreground">w</span>
                        <span>= number of tickets (1-4 based on wage level)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        <ScheduleCallCTA lowOdds={userOddsLow} />
    </>
  );
};

export default H1BLotteryCalculatorMainContent;
