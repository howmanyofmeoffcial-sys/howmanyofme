import { useState, useMemo } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import { getNameData } from "@/data/nameData";
import RelatedPosts from "@/components/RelatedPosts";
import DataFreshness from "@/components/DataFreshness";
import {
LineChart,
Line,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
ResponsiveContainer,
Legend
} from "recharts";
import { TrendingUp, TrendingDown, Clock, Info } from "lucide-react";

const COLORS = [
"hsl(220, 80%, 50%)",
"hsl(160, 60%, 45%)",
"hsl(280, 60%, 50%)",
"hsl(30, 80%, 50%)"
];

const SUGGESTED = [
"Emma","Olivia","Sophia","Isabella",
"Liam","Noah","Oliver","Elijah"
];

const SIMILAR: Record<string,string[]> = {
Emma:["Ella","Emily","Ava"],
Olivia:["Amelia","Charlotte","Sophia"],
Liam:["Noah","Lucas","Logan"],
Noah:["Liam","Elijah","Oliver"]
};

const TrendVisualizer = () => {

const [input,setInput] = useState("");
const [names,setNames] = useState<string[]>([]);

const addName = (e:React.FormEvent) => {
e.preventDefault();
const n = input.trim();
if(n && !names.includes(n) && names.length < 4){
setNames([...names,n]);
setInput("");
}
};

const removeN = (n:string)=>{
setNames(names.filter(x=>x!==n))
};

const chartData = useMemo(()=>{
if(names.length===0) return [];

return Object.keys(getNameData(names[0]).decade_popularity).map(decade=>{
const point:any = {decade};
names.forEach(n=>{
point[n] = getNameData(n).decade_popularity[decade];
});
return point;
});
},[names]);

const peakDecade = (name:string)=>{
const data = getNameData(name).decade_popularity;
let peak="";
let max=0;
Object.entries(data).forEach(([dec,val])=>{
if(val>max){
max=val;
peak=dec;
}
});
return peak;
};

return(

<div className="min-h-screen bg-background">

<SEOHead
title="Baby Name Trend Visualizer – Compare Name Popularity Over Time"
description="Compare baby name popularity trends across decades using interactive charts."
/>

{/* WebApplication Schema */}

<script
type="application/ld+json"
dangerouslySetInnerHTML={{
__html: JSON.stringify({
"@context":"https://schema.org",
"@type":"WebApplication",
"name":"Baby Name Trend Visualizer",
"applicationCategory":"UtilityApplication",
"operatingSystem":"All",
"url":"https://howmanyofme.co",
"description":"Compare baby name popularity trends across decades using interactive charts.",
"offers":{"@type":"Offer","price":"0"}
})
}}
/>

{/* FAQ Schema */}

<script
type="application/ld+json"
dangerouslySetInnerHTML={{
__html: JSON.stringify({
"@context":"https://schema.org",
"@type":"FAQPage",
"mainEntity":[
{
"@type":"Question",
"name":"How accurate is baby name popularity data?",
"acceptedAnswer":{"@type":"Answer","text":"Most datasets come from official birth records."}
},
{
"@type":"Question",
"name":"How many names can be compared?",
"acceptedAnswer":{"@type":"Answer","text":"Up to four names can be compared simultaneously."}
},
{
"@type":"Question",
"name":"Why are trends shown by decade?",
"acceptedAnswer":{"@type":"Answer","text":"Decade grouping highlights long-term patterns."}
}
]
})
}}
/>

<SiteHeader/>

<main className="container py-12 max-w-5xl">

<h1 className="font-display text-4xl font-bold mb-4">
Baby Name Trend Visualizer
</h1>

<p className="text-muted-foreground mb-8">
Add up to 4 names to visualize their popularity trends over time.
</p>

<form onSubmit={addName} className="flex gap-3 mb-6">

<input
type="text"
placeholder="Enter a name..."
value={input}
onChange={e=>setInput(e.target.value)}
className="flex-1 h-12 rounded-md border border-input bg-secondary px-4"
/>

<button
type="submit"
disabled={names.length>=4}
className="h-12 px-6 rounded-md bg-primary text-primary-foreground font-semibold"
>
Add Name
</button>

</form>

{/* Suggested names */}

<div className="flex flex-wrap gap-2 mb-8">

{SUGGESTED.map(name=>(

<button
key={name}
onClick={()=>{
if(!names.includes(name) && names.length<4){
setNames([...names,name])
}
}}
className="px-3 py-1.5 text-sm rounded-full border bg-secondary hover:bg-primary hover:text-white"
>
{name}
</button>

))}

</div>

{/* Selected names */}

{names.length>0 &&(

<div className="flex flex-wrap gap-2 mb-8">

{names.map((n,i)=>(

<span
key={n}
className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-card"
>

<span
className="w-3 h-3 rounded-full"
style={{backgroundColor:COLORS[i]}}
/>

{n}

<button
onClick={()=>removeN(n)}
className="text-muted-foreground hover:text-destructive"
>
×
</button>

</span>

))}

</div>

)}

{/* Chart */}

{chartData.length>0 &&(

<div className="rounded-xl border bg-card p-6">

<h2 className="font-display text-xl font-bold mb-6">
Popularity Over Time
</h2>

<ResponsiveContainer width="100%" height={400}>

<LineChart data={chartData}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="decade"/>

<YAxis domain={[0,100]}/>

<Tooltip/>

<Legend/>

{names.map((n,i)=>(
<Line
key={n}
type="monotone"
dataKey={n}
stroke={COLORS[i]}
strokeWidth={2.5}
dot={{r:4}}
activeDot={{r:6}}
/>
))}

</LineChart>

</ResponsiveContainer>

</div>

)}

{/* Peak Insights */}

{names.length>0 &&(

<div className="mt-10 p-6 rounded-xl border bg-card">

<h2 className="font-display text-xl font-bold mb-4">
Peak Popularity Insights
</h2>

<ul className="space-y-2 text-sm text-muted-foreground">

{names.map(n=>(
<li key={n}>
⭐ {n} peaked in popularity during the <strong>{peakDecade(n)}</strong>.
</li>
))}

</ul>

</div>

)}

{/* Insight Cards */}

<div className="grid md:grid-cols-3 gap-6 mt-12">

<div className="p-6 border rounded-xl bg-card">

<div className="flex gap-2 mb-2">
<TrendingUp size={20}/>
<h3 className="font-semibold">Rising Names</h3>
</div>

<p className="text-sm text-muted-foreground">
Names that show consistent growth across decades.
</p>

</div>

<div className="p-6 border rounded-xl bg-card">

<div className="flex gap-2 mb-2">
<TrendingDown size={20}/>
<h3 className="font-semibold">Declining Names</h3>
</div>

<p className="text-sm text-muted-foreground">
Names that were once extremely popular but are now fading.
</p>

</div>

<div className="p-6 border rounded-xl bg-card">

<div className="flex gap-2 mb-2">
<Clock size={20}/>
<h3 className="font-semibold">Timeless Names</h3>
</div>

<p className="text-sm text-muted-foreground">
Classic names that remain stable across generations.
</p>

</div>

</div>

{/* Chart Guide */}

<div className="mt-12 rounded-xl border bg-secondary/40 p-6">

<h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
<Info size={20}/> How To Read The Chart
</h2>

<ul className="space-y-2 text-sm text-muted-foreground">
<li>📊 X-axis = Decades</li>
<li>📈 Y-axis = Popularity score</li>
<li>🎨 Colors represent different names</li>
<li>🖱 Hover chart to see values</li>
</ul>

</div>

{/* LONG SEO ARTICLE */}

<section className="mt-24 space-y-16 max-w-4xl mx-auto">

<h2 className="font-display text-3xl font-bold text-center">
Understanding Baby Name Trends
</h2>

<p className="text-muted-foreground text-lg">
Baby names reflect culture, history, and generational identity.
Over decades certain names rise dramatically while others fade away.
Parents today increasingly rely on data-driven tools to explore
historical name popularity before choosing a name for their child.
</p>

<p className="text-muted-foreground">
For example, names like Emma, Olivia, and Sophia have surged
dramatically in recent decades while older names such as
Gary or Shirley have declined. Visualizing this data helps
parents understand whether a name is timeless or trending.
</p>

<h3 className="font-semibold text-xl">
How Parents Use Name Trend Data
</h3>

<p className="text-muted-foreground">
Parents often want to avoid names that are becoming overly common.
Others prefer classic names that remain popular for generations.
Analyzing decade-by-decade trends makes these patterns easy to spot.
</p>

<p className="text-muted-foreground">
This Baby Name Trend Visualizer allows users to compare
multiple names instantly using interactive charts.
</p>

<h2 className="font-display text-2xl font-bold">
Why Visualizing Name Popularity Matters
</h2>

<p className="text-muted-foreground">
Charts provide a clearer understanding of popularity patterns
than raw numbers. Parents can instantly identify rising trends,
declining names, and timeless classics.
</p>

<p className="text-muted-foreground">
These insights make it easier to select a name that fits
personal preferences and cultural context.
</p>

</section>

{/* FAQ UI */}

<section className="mt-20 max-w-3xl mx-auto">

<h2 className="font-display text-2xl font-bold mb-6 text-center">
Frequently Asked Questions
</h2>

<div className="space-y-6">

<div className="p-6 border rounded-xl">
<h3 className="font-semibold mb-2">
How accurate is baby name popularity data?
</h3>
<p className="text-sm text-muted-foreground">
Most datasets come from official birth records and statistical agencies.
</p>
</div>

<div className="p-6 border rounded-xl">
<h3 className="font-semibold mb-2">
Can I compare multiple names?
</h3>
<p className="text-sm text-muted-foreground">
Yes, the tool supports comparing up to four names simultaneously.
</p>
</div>

<div className="p-6 border rounded-xl">
<h3 className="font-semibold mb-2">
Why are trends shown by decade?
</h3>
<p className="text-sm text-muted-foreground">
Decade grouping highlights long-term popularity trends.
</p>
</div>

</div>

</section>

{/* CTA */}

<div className="text-center mt-20">

<h2 className="font-display text-3xl font-bold mb-4">
Explore Baby Name Trends Now
</h2>

<p className="text-muted-foreground mb-6">
Add your favorite names above and discover their popularity
journey across generations.
</p>

</div>

<DataFreshness toolName="Baby Name Trend Visualizer" />

<RelatedPosts currentSlug="trend-visualizer" tags={["trends", "charts", "visualization", "baby names", "interactive"]} count={12} />

</main>

<SiteFooter/>

</div>

);

};

export default TrendVisualizer;
