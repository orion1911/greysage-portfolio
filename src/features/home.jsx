import { Footer } from '../components/footer';
// import { baseMeta } from '~/utils/meta';
import { Intro } from './intro';
import { Profile } from './profile';
import { ProjectSummary } from './project-summary';
import { useEffect, useRef, useState } from 'react';
// import config from './config.json';

import styles from './home.module.css';

// Prefetch draco decoader wasm
export const links = () => {
  return [
    {
      rel: 'prefetch',
      href: '/draco/draco_wasm_wrapper.js',
      as: 'script',
      type: 'text/javascript',
      importance: 'low',
    },
    {
      rel: 'prefetch',
      href: '/draco/draco_decoder.wasm',
      as: 'fetch',
      type: 'application/wasm',
      importance: 'low',
    },
  ];
};

// export const meta = () => {
//   return baseMeta({
//     title: '',
//     description: "",
//   });
// };

const Home = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef();
  const sectionOne = useRef();
  const sectionTwo = useRef();
  const sectionThree = useRef();
  const sectionFour = useRef();
  const details = useRef();

  useEffect(() => {
    const sections = [intro, sectionOne, sectionTwo, sectionThree, sectionFour];

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            setVisibleSections(prev =>
              prev.includes(section) ? prev : [...prev, section]
            );
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      { rootMargin: '-100% 0px 0px 0px' }
    );

    sections.forEach(section => {
      if (section.current) sectionObserver.observe(section.current);
    });

    if (intro.current) indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, []);

  return (
    <div className={styles.home}>
      <Intro
        id="intro"
        sectionRef={intro}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />
      <ProjectSummary
        id="section-1"
        sectionRef={sectionOne}
        visible={visibleSections.includes(sectionOne.current)}
        index={1}
        section="Overview"
        title={<>Designing the future of <em>denim</em> wear</>}
        descriptionLead={
          <p>
            GREYSAGE is a Mumbai-based manufacturing house specializing in
            streetwear and urban apparel for the youth market. Founded in
            2015 under the label Allyz Jeans, we blend contemporary trends
            with timeless quality — empowering brands worldwide to deliver
            fresh, trend-forward collections.
          </p>
        }
        description={
          <p>
            Our work captures the spirit of modern urban life — bold,
            versatile, and forward-thinking — helping clients stay ahead in
            the fast pace of high-street fashion.
          </p>
        }
        // buttonText=""
        // buttonLink=""
        // model={{
        //   type: 'laptop',
        //   alt: 'Smart Sparrow lesson builder',
        //   textures: [
        //     {
        //       srcSet: `${sprTexture} 1280w, ${sprTextureLarge} 2560w`,
        //       placeholder: sprTexturePlaceholder,
        //     },
        //   ],
        // }}
      />
      <ProjectSummary
        id="section-2"
        alternate
        sectionRef={sectionTwo}
        visible={visibleSections.includes(sectionTwo.current)}
        index={2}
        section="Our Products"
        title={<>Premium men's bottoms, made for <em>streetwear</em>.</>}
        descriptionLead={
          <p>
            We excel in crafting premium men's bottoms that define streetwear,
            urban vibes, and future high-street trends. Denim is our prime
            focus — wide-leg, baggy, straight, and MOM fits with innovative
            washes, durable fabrics, and trend-forward details.
          </p>
        }
        description={
          <>
            <ul>
              <li><strong>Denim Jeans</strong> — wide-leg &amp; baggy bestsellers, MOM and straight fits, signature washes</li>
              <li><strong>Cargo Pants</strong> — utility pockets, adjustable fits, street-ready aesthetics</li>
              <li><strong>Shorts</strong> — modern cuts in breathable, casual urban fabrics</li>
              <li><strong>Trousers &amp; Linen</strong> — sleek tailoring with relaxed, youthful energy</li>
              <li><strong>Track Pants</strong> — comfort-driven, sporty urban flair</li>
              <li><strong>Urban Essentials</strong> — hoodies, joggers, and graphic tees</li>
            </ul>
            <p>
              Designs are inspired by youth culture and built with sustainable
              dyes, tech-infused fabrics, and customizable details — for Gen Z
              and millennial shoppers who demand authenticity.
            </p>
          </>
        }
        // buttonText=""
        // buttonLink=""
        // model={{
        //   type: 'phone',
        //   alt: 'App login screen',
        //   textures: [
        //     {
        //       srcSet: `${gamestackTexture} 375w, ${gamestackTextureLarge} 750w`,
        //       placeholder: gamestackTexturePlaceholder,
        //     },
        //     {
        //       srcSet: `${gamestackTexture2} 375w, ${gamestackTexture2Large} 750w`,
        //       placeholder: gamestackTexture2Placeholder,
        //     },
        //   ],
        // }}
      />
      <ProjectSummary
        id="section-3"
        sectionRef={sectionThree}
        visible={visibleSections.includes(sectionThree.current)}
        index={3}
        section="Services"
        title={<>End-to-end <em>solutions</em> for brands.</>}
        descriptionLead={
          <p>
            End-to-end solutions for brands targeting young audiences —
            seamless production, branding, and distribution under one roof.
          </p>
        }
        description={
          <>
            <ul>
              <li><strong>Manufacturing</strong> — state-of-the-art facilities with advanced machinery for high-volume, precision production</li>
              <li><strong>White Labeling</strong> — customize our premium products with your branding for quick launches</li>
              <li><strong>Wholesale</strong> — competitive bulk pricing on ready-to-sell inventory for retailers and e-commerce</li>
              <li><strong>FOB Shipping</strong> — efficient logistics from our Mumbai port, delivered cost-effectively to global markets</li>
            </ul>
            <p>
              Flexible MOQs for emerging brands, scalable production for
              established ones — with lead times built around seasonal trends.
            </p>
          </>
        }
        // buttonText=""
        // buttonLink=""
        // model={{
        //   type: 'laptop',
        //   alt: 'Annotating a biomedical image in the Slice app',
        //   textures: [
        //     {
        //       srcSet: `${sliceTexture} 800w, ${sliceTextureLarge} 1920w`,
        //       placeholder: sliceTexturePlaceholder,
        //     },
        //   ],
        // }}
      />
      <Profile
        sectionRef={sectionFour}
        visible={visibleSections.includes(sectionFour.current)}
        id="section-4"
      />
      <Footer />
    </div>
  );
};


export default Home;