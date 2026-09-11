"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";

import {
  Microscope,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  Building2,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Mail,
  Wrench,
  Activity,
  Award,
  Clock,
  HeartPulse,
  Sparkles,
  ChevronRight,
  Zap,
} from "lucide-react";

import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";
import ProductCard from "@/components/ProductCard";
import ContactForm from "@/components/ContactForm";
import HeroCarousel from "@/components/HeroCarousel";
import { fetchAllDynamicProducts } from "@/lib/fetchProducts";

const stats = [
  {
    number: "5,000+",
    title: "Healthcare Partners",
    desc: "Hospitals & labs served nationwide",
    icon: Building2,
  },
  {
    number: "3,500+",
    title: "Products & Kits",
    desc: "Precision diagnostic instruments",
    icon: Microscope,
  },
  {
    number: "10+ Yrs",
    title: "Engineering Excellence",
    desc: "Proven biomedical leadership",
    icon: ShieldCheck,
  },
  {
    number: "99.9%",
    title: "Accuracy SLA",
    desc: "NABL & ISO certified standards",
    icon: Award,
  },
];

const pillars = [
  {
    title: "Certified Calibration Standards",
    desc: "Every diagnostic analyzer undergoes NABL-traceable calibration to ensure precise patient diagnostics and regulatory safety.",
    icon: Award,
    badge: "ISO 13485 Certified",
  },
  {
    title: "24/7 Emergency AMC Response",
    desc: "Our nationwide team of biomedical engineers delivers rapid on-site maintenance to keep critical ICU and OT gear active.",
    icon: Zap,
    badge: "2-Hour SLA",
  },
  {
    title: "Turnkey Lab Setup & Engineering",
    desc: "From architectural workflow layout to instrument installation and staff certification, we engineer complete pathology labs.",
    icon: Building2,
    badge: "Turnkey Engineering",
  },
  {
    title: "Cold-Chain Reagent Supply",
    desc: "Strictly temperature-monitored distribution of biochemistry reagents, controls, and rapid assay kits with extended shelf life.",
    icon: FlaskConical,
    badge: "Monitored Cold Chain",
  },
];

const testimonials = [
  {
    quote:
      "Raj Biosis transformed our central laboratory setup. Their automated analyzers increased our daily sample throughput by 40% with zero downtime.",
    author: "Dr. Arvind Sharma",
    role: "Chief Pathologist",
    institution: "Apollo Diagnostics Center",
    rating: 5,
  },
  {
    quote:
      "The 24/7 AMC response team is outstanding. When our ICU patient monitor system faced a sensor issue, their engineer arrived within 90 minutes.",
    author: "Dr. Meenakshi Sundaram",
    role: "Medical Director",
    institution: "Metro Multispecialty Hospital",
    rating: 5,
  },
  {
    quote:
      "Their cold-chain reagent delivery has never failed us. Quality control results are consistently accurate, month after month.",
    author: "Rajesh Varma",
    role: "Laboratory Operations Manager",
    institution: "LifeCare PathLabs",
    rating: 5,
  },
];

export default function Home({ city }) {
  // ============================================================
  // SERVICES
  // FIREBASE ONLY - NO FALLBACK
  // ============================================================
  const [services, setServices] = useState([]);

  // ============================================================
  // PRODUCTS
  // FIREBASE ONLY - NO FALLBACK
  // ============================================================
  const [products, setProducts] = useState([]);

  const [homeData, setHomeData] = useState(null);
  const [contactInfo, setContactInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);

  const staticRoutes = [
    "about",
    "services",
    "items",
    "contact",
  ];

  const district =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  const locationTitle =
    city ||
    (district
      ? district.replace(/-/g, " ")
      : "");

  // ============================================================
  // DYNAMIC LINK HELPER
  // ============================================================
  const makeLink = (path) => {
    if (!district) return path;

    if (path === "/") {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };

  // ============================================================
  // FETCH ALL HOME DATA
  // ============================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ======================================================
        // HOME PAGE DATA
        // ======================================================
        try {
          const homeSnap = await getDoc(
            doc(
              db,
              "websites",
              "rajvedcom",
              "pages",
              "home"
            )
          );

          if (homeSnap.exists()) {
            setHomeData(
              homeSnap.data()
            );
          }
        } catch (homeErr) {
          console.error(
            "Error fetching home data:",
            homeErr
          );
        }

        // ======================================================
        // CONTACT DATA
        // ======================================================
        try {
          const contactSnap = await getDoc(
            doc(
              db,
              "websites",
              "rajvedcom",
              "pages",
              "contact"
            )
          );

          if (contactSnap.exists()) {
            setContactInfo(
              contactSnap.data()
                .contactInfo || []
            );
          } else {
            setContactInfo([]);
          }
        } catch (contactErr) {
          console.error(
            "Error fetching contact data:",
            contactErr
          );

          setContactInfo([]);
        }

        // ======================================================
        // SERVICES
        // FIREBASE ONLY
        // ======================================================
        try {
          const serviceSnap = await getDoc(
            doc(
              db,
              "websites",
              "rajvedcom",
              "pages",
              "services"
            )
          );

          if (serviceSnap.exists()) {
            const firebaseServices =
              serviceSnap.data().services;

            if (
              Array.isArray(
                firebaseServices
              ) &&
              firebaseServices.length > 0
            ) {
              const dbServices =
                firebaseServices
                  .map(
                    (service, index) => ({
                      id:
                        service?.id ||
                        `service-${index}`,

                      // ADMIN FIELD ONLY
                      title:
                        typeof service?.title ===
                          "string"
                          ? service.title.trim()
                          : "",

                      // ADMIN FIELD ONLY
                      desc:
                        typeof service?.desc ===
                          "string"
                          ? service.desc.trim()
                          : "",
                    })
                  )
                  .filter(
                    (service) =>
                      service.title ||
                      service.desc
                  );

              setServices(
                dbServices
              );
            } else {
              setServices([]);
            }
          } else {
            setServices([]);
          }
        } catch (servErr) {
          console.error(
            "Error fetching services data:",
            servErr
          );

          // NEVER USE FALLBACK SERVICES
          setServices([]);
        }

        // ======================================================
        // PRODUCTS
        // FIREBASE ONLY
        // ======================================================
        try {
          const fetchedProducts =
            await fetchAllDynamicProducts();

          if (
            Array.isArray(
              fetchedProducts
            )
          ) {
            setProducts(
              fetchedProducts
            );
          } else {
            setProducts([]);
          }
        } catch (prodErr) {
          console.error(
            "Error fetching dynamic products:",
            prodErr
          );

          setProducts([]);
        }
      } catch (err) {
        console.error(
          "Error loading home page data:",
          err
        );

        setServices([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ============================================================
  // SHOW ONLY TOP 3 PRODUCTS
  // ============================================================
  const displayedProducts =
    products.slice(0, 3);

  // ============================================================
  // STATIC SERVICE ICONS
  // ICONS ARE UI ONLY.
  // TITLE + DESCRIPTION COME FROM FIREBASE.
  // ============================================================
  const serviceIcons = [
    <Microscope
      size={28}
      key={1}
    />,
    <Building2
      size={28}
      key={2}
    />,
    <Wrench
      size={28}
      key={3}
    />,
    <FlaskConical
      size={28}
      key={4}
    />,
    <Stethoscope
      size={28}
      key={5}
    />,
    <Award
      size={28}
      key={6}
    />,
  ];

  // ============================================================
  // DYNAMIC PHONE
  // ============================================================
  const helplinePhone = (() => {
    const item =
      contactInfo.find(
        (c) =>
          c?.label
            ?.toLowerCase()
            .includes("phone") ||
          c?.label
            ?.toLowerCase()
            .includes("mobile") ||
          c?.label
            ?.toLowerCase()
            .includes("helpline") ||
          c?.label
            ?.toLowerCase()
            .includes("contact")
      );

    if (!item) return "";

    if (
      Array.isArray(item.value)
    ) {
      return (
        item.value[0] || ""
      );
    }

    return typeof item.value ===
      "string"
      ? item.value.trim()
      : "";
  })();

  // ============================================================
  // DYNAMIC EMAIL
  // ============================================================
  const supportEmail = (() => {
    const item =
      contactInfo.find(
        (c) =>
          c?.label
            ?.toLowerCase()
            .includes("email") ||
          c?.label
            ?.toLowerCase()
            .includes("mail")
      );

    if (!item) return "";

    if (
      Array.isArray(item.value)
    ) {
      return (
        item.value[0] || ""
      );
    }

    return typeof item.value ===
      "string"
      ? item.value.trim()
      : "";
  })();

  return (
    <div className="bg-[#FFF9F8] text-[#2D1818]">

      {/* ========================================================
          HERO
      ======================================================== */}
      <HeroCarousel
        homeData={homeData}
        locationTitle={locationTitle}
        makeLink={makeLink}
        loading={loading}
      />

      {/* ========================================================
          STATS TICKER
      ======================================================== */}
      <section className="bg-gradient-to-r from-[#2A1414] via-[#381C1C] to-[#2A1414] py-10 text-white shadow-inner">
        <div className="container-custom">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

            {stats.map(
              (item, idx) => {
                const Icon =
                  item.icon;

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-4"
                  >

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E05353]/25 text-[#FEEAE8] border border-[#E05353]/40">
                      <Icon size={26} />
                    </div>

                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                        {item.number}
                      </h3>

                      <p className="text-xs sm:text-sm font-bold text-[#FEEAE8]">
                        {item.title}
                      </p>

                      <p className="text-[11px] text-[#FBD5D3]/80 hidden sm:block">
                        {item.desc}
                      </p>
                    </div>

                  </div>
                );
              }
            )}

          </div>
        </div>
      </section>

      {/* ========================================================
          PILLARS
      ======================================================== */}
      <section className="section-padding bg-gradient-to-b from-white via-[#FFF9F8] to-[#FFF0EF]">
        <div className="container-custom">

          <SectionTitle
            badge="Why Modern Labs Choose Us"
            title="Technology That Feels Human"
            description="Human-centered healthcare technology with warmer, approachable visual cues."
            center
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {pillars.map(
              (pillar, index) => {
                const Icon =
                  pillar.icon;

                return (
                  <div
                    key={index}
                    className="group relative flex flex-col justify-between rounded-3xl border border-[#FBD5D3] bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#E05353]/50 hover:shadow-2xl hover:shadow-[#E05353]/15"
                  >

                    <div>

                      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0EF] text-[#E05353] transition-all duration-300 group-hover:bg-[#E05353] group-hover:text-white group-hover:scale-110 shadow-sm [&>svg]:stroke-current [&>svg]:text-current [&>svg]:transition-colors">

                        <Icon
                          size={28}
                          className="text-[#E05353] group-hover:text-white transition-colors"
                        />

                      </div>

                      <span className="mb-3 inline-block rounded-full bg-[#FFF0EF] border border-[#FBD5D3] px-3 py-1 text-xs font-bold text-[#C93B3B]">
                        {pillar.badge}
                      </span>

                      <h3 className="mb-3 text-xl font-bold text-[#2D1818] group-hover:text-[#E05353] transition-colors">
                        {pillar.title}
                      </h3>

                      <p className="text-sm leading-relaxed text-[#796565]">
                        {pillar.desc}
                      </p>

                    </div>

                    <div className="mt-8 pt-4 border-t border-[#FBD5D3]/40 flex items-center gap-2 text-xs font-bold text-[#E05353]">

                      <span>
                        Learn standard
                      </span>

                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />

                    </div>

                  </div>
                );
              }
            )}

          </div>
        </div>
      </section>

      {/* ========================================================
          FEATURED PRODUCTS
      ======================================================== */}
      <section className="section-padding bg-white border-y border-[#FBD5D3]/60">
        <div className="container-custom">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

            <SectionTitle
              badge="Diagnostic Inventory"
              title="Equipment Worth Exploring"
              description="Explore our curated catalog of automated clinical analyzers, PCR units, ICU patient monitors, and laboratory centrifuges."
            />

            <Link
              href={makeLink(
                "/items"
              )}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FFF0EF] border border-[#FBD5D3] px-6 py-3.5 text-sm font-bold text-[#E05353] shadow-sm transition-all hover:bg-[#E05353] hover:text-white hover:border-[#E05353] shrink-0"
            >
              <span>
                View All Products
              </span>

              <ArrowRight
                size={16}
              />
            </Link>

          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {loading &&
              products.length === 0 ? (

              Array.from({
                length: 3,
              }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-3xl border border-[#FBD5D3] bg-white p-6 shadow-md h-[420px] flex flex-col justify-between"
                  >

                    <div className="h-48 w-full rounded-2xl bg-[#FFF0EF]" />

                    <div className="space-y-3 mt-4">
                      <div className="h-5 w-3/4 rounded bg-[#FEEAE8]" />

                      <div className="h-4 w-full rounded bg-[#FFF0EF]" />

                      <div className="h-4 w-2/3 rounded bg-[#FFF0EF]" />
                    </div>

                    <div className="h-10 w-full rounded-2xl bg-[#FEEAE8] mt-4" />

                  </div>
                )
              )

            ) : displayedProducts.length >
              0 ? (

              displayedProducts.map(
                (prod) => (
                  <ProductCard
                    key={
                      prod.id ||
                      prod.slug
                    }
                    product={prod}
                    makeLink={
                      makeLink
                    }
                  />
                )
              )

            ) : (

              <div className="col-span-full py-12 text-center text-[#796565]">

                <p className="text-base font-bold text-[#2D1818]">
                  No products available yet.
                </p>

                <p className="mt-1 text-sm text-[#796565]">
                  Products added to the catalog will appear here dynamically.
                </p>

              </div>

            )}

          </div>
        </div>
      </section>

      {/* ========================================================
          SERVICES MATRIX
          SERVICES ARE 100% FIREBASE DYNAMIC
      ======================================================== */}
      <section className="section-padding bg-gradient-to-b from-[#FFF0EF] via-white to-[#FFF9F8]">
        <div className="container-custom">

          <SectionTitle
            badge="Healthcare Solutions"
            title="Support Built Around Your Workflow"
            description="From NABL-certified calibration to 2-hour emergency repair response, our certified engineers support your clinical operations round the clock."
            center
          />

          {/* ====================================================
              LOADING STATE
          ==================================================== */}
          {loading &&
            services.length === 0 ? (

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {Array.from({
                length: 3,
              }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-3xl border border-[#FBD5D3] bg-white p-8 shadow-md h-[320px]"
                  >

                    <div className="h-14 w-14 rounded-2xl bg-[#FFF0EF]" />

                    <div className="mt-6 h-6 w-3/4 rounded bg-[#FEEAE8]" />

                    <div className="mt-4 h-4 w-full rounded bg-[#FFF0EF]" />

                    <div className="mt-2 h-4 w-5/6 rounded bg-[#FFF0EF]" />

                    <div className="mt-2 h-4 w-2/3 rounded bg-[#FFF0EF]" />

                  </div>
                )
              )}

            </div>

          ) : services.length >
            0 ? (

            /* ==================================================
               DYNAMIC SERVICE CARDS
               ONLY TITLE + DESCRIPTION FROM FIREBASE
            ================================================== */
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {services.map(
                (srv, idx) => (
                  <ServiceCard
                    key={
                      srv.id ||
                      idx
                    }

                    icon={
                      serviceIcons[
                      idx %
                      serviceIcons.length
                      ]
                    }

                    title={
                      srv.title
                    }

                    description={
                      srv.desc
                    }

                    makeLink={
                      makeLink
                    }
                  />
                )
              )}

            </div>

          ) : (

            /* ==================================================
               NO SERVICES STATE
            ================================================== */
            <div className="mt-16 flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-[#E9B8B5] bg-white px-6 text-center shadow-sm">

              <div>

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0EF] text-[#E05353] border border-[#FBD5D3]">
                  <Wrench
                    size={30}
                  />
                </div>

                <h3 className="text-2xl font-bold text-[#2D1818]">
                  No Services Available
                </h3>

                <p className="mt-2 max-w-md text-sm leading-relaxed text-[#796565]">
                  No services have been added from the admin panel yet.
                </p>

              </div>

            </div>

          )}

        </div>
      </section>

      {/* ========================================================
          ISO & QUALITY CERTIFICATION
      ======================================================== */}
      <section className="section-padding bg-[#2A1414] text-white relative overflow-hidden">

        <div className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-[#E05353]/20 blur-3xl" />

        <div className="container-custom relative z-10">

          <div className="grid lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7">

              <span className="inline-flex items-center gap-2 rounded-full bg-[#E05353]/30 border border-[#E05353]/50 px-4 py-1.5 text-xs font-bold text-[#FEEAE8] uppercase tracking-wider">
                <Award
                  size={16}
                  className="text-[#FF7B72]"
                />
                Quality Assurance & Compliance
              </span>

              <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                Uncompromised Clinical Accuracy & Regulatory Standards
              </h2>

              <p className="mt-4 text-base sm:text-lg text-[#FBD5D3]/90 leading-relaxed">
                Raj Biosis strictly adheres to international quality protocols. Every equipment installation comes with complete IQ/OQ/PQ validation documentation and certified calibration reports.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-4">

                <div className="rounded-2xl border border-[#FBD5D3]/20 bg-white/5 p-5 backdrop-blur-sm">

                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShieldCheck
                      size={20}
                      className="text-[#FF7B72]"
                    />

                    ISO 13485 & CE Compliance
                  </h4>

                  <p className="mt-2 text-xs text-[#FBD5D3]/80">
                    Certified medical device quality management system for diagnostic analyzers.
                  </p>

                </div>

                <div className="rounded-2xl border border-[#FBD5D3]/20 bg-white/5 p-5 backdrop-blur-sm">

                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock
                      size={20}
                      className="text-[#FF7B72]"
                    />

                    2-Hour SLA Maintenance
                  </h4>

                  <p className="mt-2 text-xs text-[#FBD5D3]/80">
                    Dedicated engineer dispatch team ready for emergency hospital repairs.
                  </p>

                </div>

              </div>
            </div>

            <div className="lg:col-span-5">

              <div className="rounded-3xl border border-[#FBD5D3]/30 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-md text-center">

                <div className="mx-auto flex h-24 w-24 sm:h-28 sm:w-28 flex-col items-center justify-center rounded-full bg-gradient-to-br from-[#FF7B72] via-[#E05353] to-[#C93B3B] text-white shadow-2xl shadow-[#E05353]/50 border-2 border-white/40 p-2">

                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
                    100%
                  </span>

                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#FEEAE8] mt-1">
                    Certified
                  </span>

                </div>

                <h3 className="mt-6 text-2xl font-bold text-white">
                  Compliance Guarantee
                </h3>

                <p className="mt-3 text-sm text-[#FBD5D3]/90 leading-relaxed">
                  All instruments tested with traceable reference standards before dispatch to your medical facility.
                </p>

                <Link
                  href={makeLink(
                    "/contact"
                  )}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E05353] text-white px-8 py-3.5 text-sm font-bold shadow-xl shadow-[#E05353]/40 transition-all hover:bg-[#C93B3B] hover:shadow-2xl hover:-translate-y-0.5 border border-white/20"
                >
                  <span className="font-bold text-white">
                    Request Inspection Certificate
                  </span>

                  <ArrowRight
                    size={16}
                    className="text-white"
                  />
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          TESTIMONIALS
      ======================================================== */}
      <section className="section-padding bg-gradient-to-b from-white via-[#FFF9F8] to-[#FFF0EF]">
        <div className="container-custom">

          <SectionTitle
            badge="What Our Partners Say"
            title="Chosen by Diagnostic Teams"
            description="Read how healthcare professionals rely on Raj Biosis for accurate diagnostics and uninterrupted equipment uptime."
            center
          />

          <div className="mt-16 grid gap-8 lg:grid-cols-3">

            {testimonials.map(
              (t, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-3xl border border-[#FBD5D3] bg-white p-8 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                >

                  <div>

                    <div className="flex gap-1 text-[#E05353] mb-4">

                      {Array.from({
                        length: t.rating,
                      }).map(
                        (_, i) => (
                          <span
                            key={i}
                          >
                            ★
                          </span>
                        )
                      )}

                    </div>

                    <p className="text-sm sm:text-base leading-relaxed text-[#796565] italic">
                      &ldquo;
                      {t.quote}
                      &rdquo;
                    </p>

                  </div>

                  <div className="mt-8 border-t border-[#FBD5D3]/60 pt-4 flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF0EF] text-[#E05353] font-bold text-lg">
                      {t.author.charAt(
                        4
                      ) || "D"}
                    </div>

                    <div>

                      <h4 className="text-base font-bold text-[#2D1818]">
                        {t.author}
                      </h4>

                      <p className="text-xs text-[#796565]">
                        {t.role} —{" "}
                        <span className="text-[#E05353] font-bold">
                          {t.institution}
                        </span>
                      </p>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>
        </div>
      </section>

      {/* ========================================================
          QUICK INQUIRY FORM
      ======================================================== */}
      <section className="section-padding bg-gradient-to-br from-[#FFF0EF] via-white to-[#FEEAE8] border-t border-[#FBD5D3]">

        <div className="container-custom">

          <div className="grid lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-5">

              <SectionTitle
                badge="Direct Consultation"
                title="Planning a Purchase or Need Technical Guidance?"
                description="Our biomedical engineering consultants will analyze your laboratory requirements, recommend optimal instruments, and provide a customized quote."
              />

              <div className="mt-8 space-y-4">

                {helplinePhone && (
                  <a
                    href={`tel:${String(
                      helplinePhone
                    ).replace(
                      /\s+/g,
                      ""
                    )}`}
                    className="flex items-center gap-4 rounded-2xl border border-[#FBD5D3] bg-white p-4 shadow-sm hover:border-[#E05353]/50 transition-colors"
                  >

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF0EF] text-[#E05353] shrink-0">
                      <PhoneCall
                        size={22}
                      />
                    </div>

                    <div>

                      <p className="text-xs font-bold text-[#796565]">
                        Direct Helpline
                      </p>

                      <p className="text-base font-bold text-[#2D1818]">
                        {helplinePhone}
                      </p>

                    </div>

                  </a>
                )}

                {supportEmail && (
                  <a
                    href={`mailto:${supportEmail}`}
                    className="flex items-center gap-4 rounded-2xl border border-[#FBD5D3] bg-white p-4 shadow-sm hover:border-[#E05353]/50 transition-colors"
                  >

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF0EF] text-[#E05353] shrink-0">
                      <Mail
                        size={22}
                      />
                    </div>

                    <div>

                      <p className="text-xs font-bold text-[#796565]">
                        Official Email
                      </p>

                      <p className="text-base font-bold text-[#2D1818] break-all">
                        {supportEmail}
                      </p>

                    </div>

                  </a>
                )}

              </div>
            </div>

            <div className="lg:col-span-7">

              <ContactForm
                title="Request a Tailored Equipment Plan"
                subtitle="Fill out the form below and our equipment specialist will reach out within 2 hours."
              />

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}