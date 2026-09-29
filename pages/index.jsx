import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next"; // Assuming you're using 'cookies-next' to handle cookies
import NavbarH from "@/components/navbar/navbar";
const Floatingnavbar = dynamic(() => import("@/components/navbar/flotingnavbar"), { ssr: false });
import Searchmedia from "@/components/searchMedia";
const Ourservices = dynamic(() => import("@/components/ourServices"));
const City = dynamic(() => import("@/components/cityList"));
const Enquire = dynamic(() => import("@/components/enquire/enquire"));
const OurClients = dynamic(() => import("@/components/ourClients"));
const TrendingCity = dynamic(() => import("@/components/trendingcity"));
const WordCounts = dynamic(() => import("@/components/wordCounts"));
const WelcomeForm = dynamic(() => import("@/components/welcomeForm"));
const GohBlog = dynamic(() => import("@/components/blogs"));
const GohNews = dynamic(() => import("@/components/news"));

// Country Data Mapping
const COUNTRY_DATA = {
  IN: { name: "India" },
  AE: { name: "UAE" },
  ZA: { name: "South Africa" },
  // Add more countries here...
};

export default function Home() {
  const { asPath } = useRouter();
  
  // Retrieve the selected country code from the cookie
  const selectedCountryCode = getCookie("selected_country") || "IN"; // Default to "IN" if no cookie exists
  const selectedCountry = COUNTRY_DATA[selectedCountryCode] || COUNTRY_DATA.IN; // Fallback to India if country is not found
  
  // Dynamically setting Hotjar tracking code
  const hotjarTrackingCode = `(function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:3792413,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;

  return (
    <>
      <Head>
        <link rel="canonical" href={`https://www.gohoardings.com`} />
        <title>
          {`Gohoardings: ${selectedCountry.name}'s Largest and Best Outdoor Advertising Agency`}
        </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content={`We are the largest outdoor advertising agency in ${selectedCountry.name}, advertise your brand with the best hoarding company. Get your first OOH advertising solution now.`}
        />
        <meta
          name="google-site-verification"
          content="fLT70DRZGdH5FUdrS8w1k2Zg_VTzNJGDF9ie9v4FAzM"
        />
        <meta
          name="keywords"
          content="gohoardings, go hoardings, outdoor advertising, outdoor advertising agency, outdoor advertising company, best advertising company, outdoor media, outdoor media company, ooh advertising, ooh ad agency, best ad agency in india, largest advertising agency in india, bus advertising, airport advertising, metro advertising, transit advertising"
        />
        <meta
          property="og:title"
          content={`${selectedCountry.name}'s Largest Outdoor Advertising Agency | Gohoarding Solution`}
        />
        <meta property="og:siteName" content="www.gohoardings.com" />
        <meta
          property="og:description"
          content={`We are helping businesses to grow offline with hoardings, billboards ads, bus shelters, metro pillars, airport, and office brandings in ${selectedCountry.name} | Gohoardings`}
        />
        <meta property="og:type" content="en_US" />
        <meta property="og:url" href={`https://www.gohoardings.com${asPath}`} />
        <meta property="twitter:title" content={`${selectedCountry.name}'s Largest Outdoor Advertising Agency | Gohoarding Solution`} />
        <meta property="twitter:siteName" content="www.gohoardings.com" />
        <meta
          property="twitter:description"
          content={`We are helping businesses to grow offline with hoardings, billboards ads, bus shelters, metro pillars, airport, and office brandings in ${selectedCountry.name} | Gohoardings`}
        />
        <meta property="twitter:type" content="en_US" />
        <meta property="twitter:url" href={`https://www.gohoardings.com${asPath}`} />
        <script dangerouslySetInnerHTML={{ __html: hotjarTrackingCode }} />
      </Head>
      <main className="animate__animated animate__fadeIn">
        <NavbarH />
        <Floatingnavbar />
        <Searchmedia />
        <Ourservices />
        <City />
        <Enquire />
        <OurClients />
        <TrendingCity />
        <GohBlog />
        <GohNews />
        <WordCounts />
        <WelcomeForm />
      </main>
    </>
  );
}
