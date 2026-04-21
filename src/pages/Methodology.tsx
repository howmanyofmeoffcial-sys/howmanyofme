import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";

const Methodology = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="Methodology — How We Calculate Name Statistics" description="Learn about our methodology for estimating name frequency, including data sources, survival modeling, and confidence scoring." />
    <SiteHeader />
    <main className="container py-12 max-w-3xl prose-content">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Our Methodology</h1>

      <h2>Data Collection</h2>
      <p>We aggregate name registration data from official government sources across 80+ countries, including the U.S. SSA, UK ONS, Statistics Canada, and the Australian Bureau of Statistics.</p>

      <h2>Survival Modeling</h2>
      <p>We apply actuarial survival curves to estimate how many bearers of a name from each birth year are still living, using country-specific and gender-specific life tables from the WHO.</p>

      <h2>Migration Adjustment</h2>
      <p>Using UN international migration flow data, we adjust country-specific estimates to account for emigration and immigration patterns.</p>

      <h2>Confidence Scoring</h2>
      <p>Each estimate receives a confidence score. Common names in well-documented countries have ±5% accuracy, while rarer names may have ±15-25% ranges.</p>

      <h2>Update Frequency</h2>
      <p>Our dataset is updated quarterly with the latest available birth registration and demographic data.</p>
    </main>
    <SiteFooter />
  </div>
);

export default Methodology;
