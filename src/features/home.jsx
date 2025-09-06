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
    // const sections = [intro, sectionOne, sectionTwo, sectionThree, details];
    const sections = [intro, sectionOne, sectionTwo, sectionThree, sectionFour];

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            if (visibleSections.includes(section)) return;
            setVisibleSections(prevSections => [...prevSections, section]);
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
      sectionObserver.observe(section.current);
    });

    indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections]);

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
        title="Designing the future of denim wear"
        // description="Design and manufacture denim wear for brands and retailers around the world"
        description="GREYSAGE is a dynamic manufacturing powerhouse based in the vibrant heart of Mumbai, India, 
        specializing in cutting-edge streetwear and urban apparel designed to captivate the youth market. Founded in the year 2019 under the 
        label Allyz Jeans with a passion for blending contemporary trends with timeless quality, we empower brands worldwide to deliver fresh, 
        trendsetting collections that resonate with young, style-savvy consumers. 
        
        Our expertise lies in creating garments that embody the spirit of modern urban life—bold, versatile, and forward-thinking. 
        Helping our clients stay ahead in the fast-paced world of high street urban fashion."
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
        // style={{ height: '72vh' }}
        section="Our Products"
        title="At GREYSAGE, we excel in crafting premium men's bottoms that define streetwear, urban vibes, and future high street trends."
        description={<p>Our core offerings include:
          <br /> - Denim Jeans (Prime Focus): From wide-leg and baggy jeans to straight-fit and MOM-fit styles, our jeans feature innovative washes, durable fabrics, and trend-forward details like unique pocket designs and eco-conscious materials. Our best-sellers include wide-leg and baggy jeans, catering to the bold, expressive tastes of young consumers.
          <br /> - Cargo Pants: Functional and fashionable, with multiple utility pockets, adjustable fits, and fabrics that balance comfort with street-ready aesthetics.
          <br /> - Shorts: Versatile and stylish, designed for casual urban looks with a focus on modern cuts and breathable materials.
          <br /> - Trousers and Linen Pants: Sleek, tailored options that merge sophistication with relaxed, youthful energy.
          <br /> - Track Pants: Comfort-driven designs with sporty, urban flair, perfect for the active, trend-conscious demographic.
          <br /> - Additional Urban Essentials: We also produce complementary items like hoodies, joggers, and graphic tees, all aligned with the latest global fashion trends to keep your brand's lineup fresh.
          <br /><br /> Our designs are inspired by youth culture, incorporating sustainable dyes, tech-infused fabrics, and customizable features to appeal to Gen Z and millennial shoppers who demand authenticity and innovation.</p>}
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
        // style={{ height: '72vh' }}
        section="Services We Offer"
        title="GREYSAGE provides end-to-end solutions tailored for brands targeting young audiences, ensuring seamless production and distribution"
        description={<p>
          <br /> - Manufacturing: State-of-the-art facilities equipped with advanced machinery for high-volume, precision production.
          <br /> - White Labeling: Customize our premium products with your branding, enabling quick launches without in-house design.
          <br /> - Wholesale: Competitive bulk pricing for ready-to-sell inventory, ideal for retailers and e-commerce platforms catering to trend-conscious youth.
          <br /> - FOB (Free on Board): Efficient shipping from our Mumbai port, streamlining logistics to deliver your products to global markets cost-effectively.
          <br /><br /> - We offer flexibility with low MOQs for emerging brands and scalable options for established ones, maintaining lead times that align with seasonal trends.
        </p>}
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