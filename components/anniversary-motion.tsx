"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-client";

export default function AnniversaryMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".anniversary-page");
    if (!root) return;

    let cancelled = false;
    let timeoutId: number | undefined;
    let heroTimeline: gsap.core.Timeline | undefined;
    const timelineMedia = gsap.matchMedia();

    const context = gsap.context(() => {
      const select = gsap.utils.selector(root);
      const desktop = window.innerWidth >= 768;
      const header = document.querySelector(".site-header");
      const art = select(".hero-art")[0];
      const eyebrow = select(".hero-eyebrow")[0];
      const logo = select(".hero-anniversary-logo")[0];
      const years = select(".hero-years")[0];
      const description = select(".hero-description")[0];
      const left = select(".hero-side-left")[0];
      const right = select(".hero-side-right")[0];

      heroTimeline = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
      if (header) {
        heroTimeline.fromTo(header, { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 0.72 }, 0);
      }
      heroTimeline
        .fromTo(art, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 0)
        .fromTo(eyebrow, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.12)
        .fromTo(logo, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.9 }, 0.28)
        .fromTo(years, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.59)
        .fromTo(description, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.78 }, 0.82);
      if (desktop) {
        heroTimeline
          .fromTo(left, { autoAlpha: 0, x: -20 }, { autoAlpha: 0.9, x: 0, duration: 0.9 }, 0.48)
          .fromTo(right, { autoAlpha: 0, x: 20 }, { autoAlpha: 0.9, x: 0, duration: 0.9 }, 0.7);
      }

      const timelineSection = select(".timeline-section")[0];
      const heading = select(".section-heading")[0];
      const milestones = select(".milestone");
      const makeTimeline = () => gsap.timeline({
        scrollTrigger: { trigger: timelineSection, start: "top 72%", once: true },
      }).fromTo(heading.querySelector("h2"),
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0)
        .fromTo(heading.querySelector("p"),
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0.12);

      const revealMilestone = (timeline: gsap.core.Timeline, index: number, at: number) => {
        const milestone = milestones[index];
        const visual = milestone.querySelector(".milestone-visual");
        const copy = milestone.querySelector(".milestone-copy");
        const dot = milestone.querySelector(".milestone-dot");
        timeline.fromTo([visual, copy],
          { autoAlpha: 0, y: 20, scale: 0.95 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: "power2.out" }, at)
          .fromTo(dot,
            { autoAlpha: 0, scale: 0 },
            { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power2.out" }, at);
      };

      timelineMedia.add("(min-width: 901px)", () => {
        const timeline = makeTimeline();
        const rowDuration = 1.4;
        const rowLines = select(".timeline-row-progress-line") as HTMLElement[];
        [0, 1].forEach((row) => {
          const rowStart = row === 0 ? 0.55 : 2.1;
          const line = rowLines[row];
          gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
          timeline.to(line, { scaleX: 1, duration: rowDuration, ease: "none" }, rowStart);
          for (let column = 0; column < 5; column += 1) {
            const index = row * 5 + column;
            const card = milestones[index] as HTMLElement;
            const dotCenter = card.offsetLeft + card.offsetWidth / 2;
            const at = rowStart + ((dotCenter - line.offsetLeft) / line.offsetWidth) * rowDuration;
            revealMilestone(timeline, index, at);
          }
        });
      });

      timelineMedia.add("(max-width: 900px)", () => {
        const timeline = makeTimeline();
        const grid = select(".timeline-grid")[0] as HTMLElement;
        const progressLine = grid.querySelector<HTMLElement>(".timeline-progress-line")!;
        const dotCenters = () => milestones.map((milestone) => {
          const card = milestone as HTMLElement;
          const dot = card.querySelector<HTMLElement>(".milestone-dot")!;
          return card.offsetTop + dot.offsetTop + dot.offsetHeight / 2;
        });
        const positionLine = () => {
          const centers = dotCenters();
          progressLine.style.top = `${centers[0]}px`;
          progressLine.style.height = `${centers[centers.length - 1] - centers[0]}px`;
          return centers;
        };
        const centers = positionLine();
        const resizeObserver = new ResizeObserver(positionLine);
        resizeObserver.observe(grid);

        const lineStart = 0.55;
        const lineDuration = 2.9;
        const lineLength = centers[centers.length - 1] - centers[0];
        gsap.set(progressLine, { scaleY: 0, transformOrigin: "center top" });
        timeline.to(progressLine, { scaleY: 1, duration: lineDuration, ease: "none" }, lineStart);
        milestones.forEach((milestone, index) => {
          const at = lineStart + ((centers[index] - centers[0]) / lineLength) * lineDuration;
          const dot = milestone.querySelector(".milestone-dot");
          const visual = milestone.querySelector(".milestone-visual");
          const copy = milestone.querySelector(".milestone-copy");
          timeline.fromTo(dot,
            { autoAlpha: 0, scale: 0 },
            { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power1.out" }, at)
            .fromTo(visual,
              { autoAlpha: 0, scale: 0.9, y: 10 },
              { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, ease: "power2.out" }, at + 0.03)
            .fromTo(copy,
              { autoAlpha: 0, y: 12 },
              { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, at + 0.1);
        });
        return () => resizeObserver.disconnect();
      });

      const stats = select(".stats-bar")[0];
      gsap.timeline({ scrollTrigger: { trigger: stats, start: "top 80%", once: true } })
        .fromTo(stats, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" })
        .fromTo(select(".stat"), { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.75, ease: "power2.out" }, "<0.05");

      const event = select(".event-section")[0] as HTMLElement | undefined;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (event && !reducedMotion) {
        const selectEvent = gsap.utils.selector(event);
        const eventEyebrow = selectEvent("[data-event-eyebrow]")[0];
        const eventTitle = selectEvent("[data-event-title]")[0];
        const eventDescription = selectEvent("[data-event-description]")[0];
        const eventMeta = selectEvent("[data-event-meta]")[0];

        gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: event, start: "top 78%", once: true },
        })
          .fromTo(eventEyebrow,
            { autoAlpha: 0, y: desktop ? 16 : 10 },
            { autoAlpha: 1, y: 0, duration: desktop ? 0.6 : 0.5 }, 0)
          .fromTo(eventTitle,
            { autoAlpha: 0, y: desktop ? 24 : 15 },
            { autoAlpha: 1, y: 0, duration: desktop ? 0.8 : 0.62 }, 0.12)
          .fromTo(eventDescription,
            { autoAlpha: 0, y: desktop ? 12 : 8 },
            { autoAlpha: 1, y: 0, duration: desktop ? 0.6 : 0.5 }, 0.28)
          .fromTo(eventMeta,
            { autoAlpha: 0, y: desktop ? 16 : 10, scale: 0.97 },
            { autoAlpha: 1, y: 0, scale: 1, duration: desktop ? 0.6 : 0.5 }, 0.4);

        selectEvent("[data-event-divider]").forEach((divider) => {
          const lines = divider.querySelectorAll("span");
          const title = divider.querySelector("h3");
          gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: { trigger: divider, start: "top 84%", once: true },
          })
            .fromTo(lines[0],
              { scaleX: 0, transformOrigin: "right center" },
              { scaleX: 1, duration: desktop ? 0.7 : 0.55 }, 0)
            .fromTo(lines[1],
              { scaleX: 0, transformOrigin: "left center" },
              { scaleX: 1, duration: desktop ? 0.7 : 0.55 }, 0)
            .fromTo(title,
              { autoAlpha: 0, y: desktop ? 10 : 7 },
              { autoAlpha: 1, y: 0, duration: desktop ? 0.6 : 0.48 }, 0.06);
        });

        const eventLayout = selectEvent("[data-event-layout]")[0];
        const infoItems = selectEvent("[data-event-info-item]");
        const mapButton = selectEvent("[data-event-map-button]")[0];
        const venueMain = selectEvent("[data-event-venue-main]")[0];
        const venueSmall = selectEvent("[data-event-venue-small]");

        gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: eventLayout, start: "top 82%", once: true },
        })
          .fromTo(infoItems,
            { autoAlpha: 0, x: desktop ? -24 : -14 },
            {
              autoAlpha: 1,
              x: 0,
              duration: desktop ? 0.55 : 0.46,
              stagger: desktop ? 0.1 : 0.07,
            }, 0)
          .fromTo(mapButton,
            { autoAlpha: 0, y: desktop ? 10 : 7, scale: 0.98 },
            { autoAlpha: 1, y: 0, scale: 1, duration: desktop ? 0.55 : 0.46 }, 0.32)
          .fromTo(venueMain,
            { autoAlpha: 0, x: desktop ? 30 : 16, scale: 0.98 },
            { autoAlpha: 1, x: 0, scale: 1, duration: desktop ? 0.72 : 0.56 }, 0.08)
          .fromTo(venueSmall,
            { autoAlpha: 0, x: desktop ? 20 : 12 },
            {
              autoAlpha: 1,
              x: 0,
              duration: desktop ? 0.58 : 0.48,
              stagger: desktop ? 0.1 : 0.07,
            }, 0.2);

        const eventTimeline = selectEvent("[data-event-timeline]")[0];
        const timelineRails = selectEvent("[data-event-timeline-rail]");
        const timelineItems = selectEvent("[data-event-timeline-item]");
        const timelineDots = selectEvent("[data-event-timeline-dot]");

        gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: eventTimeline, start: "top 82%", once: true },
        })
          .fromTo(timelineRails,
            { scaleY: 0, transformOrigin: "center top" },
            {
              scaleY: 1,
              duration: desktop ? 0.38 : 0.3,
              stagger: desktop ? 0.09 : 0.065,
              ease: "none",
            }, 0)
          .fromTo(timelineItems,
            { autoAlpha: 0, y: desktop ? 18 : 11 },
            {
              autoAlpha: 1,
              y: 0,
              duration: desktop ? 0.5 : 0.42,
              stagger: desktop ? 0.09 : 0.065,
            }, 0.1)
          .fromTo(timelineDots,
            { autoAlpha: 0, scale: 0 },
            {
              autoAlpha: 1,
              scale: 1,
              duration: desktop ? 0.25 : 0.2,
              stagger: desktop ? 0.09 : 0.065,
              ease: "back.out(1.5)",
            }, 0.12);

        const notice = selectEvent("[data-event-notice]")[0];
        const noticeItems = selectEvent("[data-event-notice-item]");
        gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: notice, start: "top 85%", once: true },
        })
          .fromTo(notice,
            { autoAlpha: 0, y: desktop ? 24 : 15 },
            { autoAlpha: 1, y: 0, duration: desktop ? 0.7 : 0.55 }, 0)
          .fromTo(noticeItems,
            { autoAlpha: 0, x: desktop ? 12 : 8 },
            {
              autoAlpha: 1,
              x: 0,
              duration: desktop ? 0.5 : 0.42,
              stagger: desktop ? 0.08 : 0.06,
            }, 0.16);
      }

      const footer = document.querySelector<HTMLElement>(".anniversary-footer");
      if (footer) {
        const selectFooter = gsap.utils.selector(footer);
        gsap.timeline({ scrollTrigger: { trigger: footer, start: "top 88%", once: true } })
        .fromTo(selectFooter(".footer-top>a"), { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.75, ease: "power2.out" }, 0)
        .fromTo(selectFooter(".footer-top nav"), { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.75, ease: "power2.out" }, 0.09)
        .fromTo(selectFooter(".footer-top nav a"), { autoAlpha: 0, y: 7 },
          { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.56, ease: "power2.out" }, 0.14)
        .fromTo(selectFooter(".footer-script"), { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0.18)
        .fromTo(selectFooter(".social-links a"), { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.65, ease: "power2.out" }, 0.24);
      }
    }, root);

    const startHero = async () => {
      const logo = root.querySelector<HTMLImageElement>(".hero-anniversary-logo");
      const background = new window.Image();
      background.src = "/assets/anniversary-hero.jpg";
      await Promise.race([
        Promise.allSettled([document.fonts.ready, logo?.decode(), background.decode()]),
        new Promise((resolve) => { timeoutId = window.setTimeout(resolve, 2000); }),
      ]);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (cancelled) return;
      heroTimeline?.play(0);
      ScrollTrigger.refresh();
    };
    void startHero();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      timelineMedia.revert();
      context.revert();
    };
  }, []);

  return null;
}
