import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import Container from "./Container";

// TIP: If you want words to be highlighted use JSX in the prop
// and wrap the word in <mark> tags
const PageHeader = ({ title, summary, children }: PageHeaderProps) => {
  const scrollRef = useRef<HTMLElement>(null);
  const [outOfView, setOutOfView] = useState(false);

  useLayoutEffect(() => {
    watchScroll();
  }, []);

  const watchScroll = () => {
    const heightOfElement = scrollRef.current?.offsetHeight || 100;

    const observerCallback = (entries: any) => {
      if (!entries[0].isIntersecting) {
        setOutOfView(true);
      } else {
        setOutOfView(false);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: `-${heightOfElement}px 0px 0px 0px`,
    });

    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }
  };

  return (
    <section>
      <Container className="pt-20 pb-16">
        <header
          ref={scrollRef}
          className={clsx(
            "max-w-md pr-24 font-brand sm:pr-0",
            outOfView ? "animate__animated animate__fadeOut animate__faster" : "animate__animated animate__fadeIn"
          )}
        >
          <h1 className="text-3xl font-extrabold text-slate-700 dark:text-slate-400 sm:text-4xl">{title}</h1>
          {summary && <p className="mt-4 text-slate-800">{summary}</p>}
        </header>
        {children}
      </Container>
    </section>
  );
};

type PageHeaderProps = {
  children?: ReactNode;
  title: string | ReactNode;
  summary?: string | ReactNode;
};

export default PageHeader;
