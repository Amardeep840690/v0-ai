## Dummy AI response — first generation
const dummyAIResponse = {
  assistantMessage:
    "I've created a modern coffee shop landing page with a navbar, hero section, featured products, and footer.",

  changes: [
    {
      type: "CREATE",
      oldPath: null,
      newPath: "app/page.tsx",
      content: `import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Products } from "@/components/Products";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Products />
      <Footer />
    </main>
  );
}`,
    },

    {
      type: "CREATE",
      oldPath: null,
      newPath: "components/Navbar.tsx",
      content: `export function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-xl font-bold">Brew & Bean</h1>

      <div className="flex gap-6 text-sm">
        <a href="#home">Home</a>
        <a href="#menu">Menu</a>
        <a href="#about">About</a>
      </div>
    </nav>
  );
}`,
    },

    {
      type: "CREATE",
      oldPath: null,
      newPath: "components/Hero.tsx",
      content: `export function Hero() {
  return (
    <section className="px-6 py-24 text-center">
      <p className="mb-3 text-sm font-medium">
        Freshly roasted every morning
      </p>

      <h2 className="text-5xl font-bold">
        Your perfect cup starts here.
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        Discover handcrafted coffee made from carefully selected beans.
      </p>
    </section>
  );
}`,
    },

    {
      type: "CREATE",
      oldPath: null,
      newPath: "components/Products.tsx",
      content: `const products = [
  {
    name: "Classic Latte",
    price: "$4.50",
  },
  {
    name: "Cappuccino",
    price: "$4.00",
  },
  {
    name: "Cold Brew",
    price: "$4.75",
  },
];

export function Products() {
  return (
    <section className="grid gap-4 px-6 py-12 md:grid-cols-3">
      {products.map((product) => (
        <div key={product.name} className="rounded-xl border p-6">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="mt-2 text-muted-foreground">{product.price}</p>
        </div>
      ))}
    </section>
  );
}`,
    },

    {
      type: "CREATE",
      oldPath: null,
      newPath: "components/Footer.tsx",
      content: `export function Footer() {
  return (
    <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
      © 2026 Brew & Bean. All rights reserved.
    </footer>
  );
}`,
    },
  ],
};


## Dummy AI response — UPDATE existing file
const dummyAIResponse = {
  assistantMessage:
    "I've updated the navbar to use an emerald color theme.",

  changes: [
    {
      type: "UPDATE",
      oldPath: "components/Navbar.tsx",
      newPath: "components/Navbar.tsx",
      content: `export function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-emerald-200 bg-emerald-50 px-6 py-4">
      <h1 className="text-xl font-bold text-emerald-900">
        Brew & Bean
      </h1>

      <div className="flex gap-6 text-sm text-emerald-800">
        <a href="#home">Home</a>
        <a href="#menu">Menu</a>
        <a href="#about">About</a>
      </div>
    </nav>
  );
}`,
    },
  ],
};

## Dummy AI response — CREATE new file + UPDATE existing file

const dummyAIResponse = {
  assistantMessage:
    "I've added a pricing section with three coffee subscription plans.",

  changes: [
    {
      type: "CREATE",
      oldPath: null,
      newPath: "components/Pricing.tsx",
      content: `const plans = [
  {
    name: "Starter",
    price: "$12",
    description: "5 cups per month",
  },
  {
    name: "Classic",
    price: "$24",
    description: "12 cups per month",
  },
  {
    name: "Premium",
    price: "$39",
    description: "20 cups per month",
  },
];

export function Pricing() {
  return (
    <section className="px-6 py-16">
      <h2 className="text-center text-3xl font-bold">
        Coffee subscriptions
      </h2>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className="rounded-xl border p-6">
            <h3 className="font-semibold">{plan.name}</h3>
            <p className="mt-3 text-2xl font-bold">{plan.price}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {plan.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}`,
    },

    {
      type: "UPDATE",
      oldPath: "app/page.tsx",
      newPath: "app/page.tsx",
      content: `import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Products } from "@/components/Products";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Products />
      <Pricing />
      <Footer />
    </main>
  );
}`,
    },
  ],
};

## Test MOVE / RENAME
const dummyAIResponse = {
  assistantMessage:
    "I've renamed Hero.tsx to LandingHero.tsx and updated the project reference.",

  changes: [
    {
      type: "MOVE",
      oldPath: "components/Hero.tsx",
      newPath: "components/LandingHero.tsx",
      content: `export function LandingHero() {
  return (
    <section className="px-6 py-24 text-center">
      <p className="mb-3 text-sm font-medium">
        Freshly roasted every morning
      </p>

      <h2 className="text-5xl font-bold">
        Your perfect cup starts here.
      </h2>
    </section>
  );
}`,
    },

    {
      type: "UPDATE",
      oldPath: "app/page.tsx",
      newPath: "app/page.tsx",
      content: `import { Navbar } from "@/components/Navbar";
import { LandingHero } from "@/components/LandingHero";
import { Products } from "@/components/Products";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <LandingHero />
      <Products />
      <Pricing />
      <Footer />
    </main>
  );
}`,
    },
  ],
};

## TEST DELETE
const dummyAIResponse = {
  assistantMessage: "I've removed the footer from the project.",

  changes: [
    {
      type: "DELETE",
      oldPath: "components/Footer.tsx",
      newPath: null,
    },

    {
      type: "UPDATE",
      oldPath: "app/page.tsx",
      newPath: "app/page.tsx",
      content: `import { Navbar } from "@/components/Navbar";
import { LandingHero } from "@/components/LandingHero";
import { Products } from "@/components/Products";
import { Pricing } from "@/components/Pricing";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <LandingHero />
      <Products />
      <Pricing />
    </main>
  );
}`,
    },
  ],
};
