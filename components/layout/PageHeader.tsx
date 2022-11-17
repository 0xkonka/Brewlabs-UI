import { ReactNode, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import clsx from "clsx";
import Image from "next/future/image";
import Container from "./Container";

// TIP: If you want words to be highlighted use JSX in the prop
// and wrap the word in <mark> tags

const PageHeader = ({ title, summary, children }: PageHeaderProps) => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <section data-aos="fade-down" className={clsx("relative")}>
      <Container className="pt-20 pb-16">
        <header className="max-w-md pr-24 font-brand sm:pr-0">
          <h1 className="text-3xl font-extrabold text-slate-700 dark:text-slate-400 sm:text-4xl">{title}</h1>
          {summary && <p className="mt-4 text-slate-800">{summary}</p>}
        </header>
        {children}
      </Container>
      <Image
        className="absolute bottom-0 w-full dark:hidden"
        src="./images/wave.svg"
        alt=""
        width={567}
        height={567}
        unoptimized
        priority
      />
    </section>
  );
};

type PageHeaderProps = {
  children?: ReactNode;
  title: string | ReactNode;
  summary?: string | ReactNode;
};

export default PageHeader;
