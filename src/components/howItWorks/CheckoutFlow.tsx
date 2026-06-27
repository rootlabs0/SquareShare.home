"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { CreditCard, Lock, Check } from "lucide-react";
import CursorPointer from "./CursorPointer";
import { STOREFRONT_SLOTS, CHECKOUT_PRODUCT } from "./data";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const CUSTOMER = "#a855f7";

type Stage = "browse" | "pay" | "confirm";

const EMAIL = "you@studio.com";
const CARD = "4242 4242 4242 4242";
const EXP = "04 / 28";
const CVC = "123";

function Caret({ active }: { active: boolean }) {
  return active ? (
    <span className="ml-0.5 inline-block h-3 w-px animate-pulse bg-neutral-700 align-middle" />
  ) : null;
}

// Step 3: a 3-stage sale. A "customer" cursor clicks a product, the Stripe
// payment modal opens and fills itself in, then a confirmation modal appears.
export default function CheckoutFlow() {
  const [scope, animate] = useAnimate();
  const inView = useInView(scope, { amount: 0.4 });
  const reduced = useReducedMotion();

  const cursorRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLButtonElement>(null);
  const payRef = useRef<HTMLDivElement>(null);

  const [stage, setStage] = useState<Stage>("browse");
  const [clicking, setClicking] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [typing, setTyping] = useState<string | null>(null);

  const center = (el: HTMLElement | null) => {
    const root = scope.current as HTMLElement | null;
    if (!el || !root) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    const b = root.getBoundingClientRect();
    return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height / 2 };
  };

  useEffect(() => {
    // Reduced motion: skip the loop and show the static completed-sale state
    // via the derived display values below.
    if (reduced) return;
    if (!inView) return;
    let cancelled = false;

    const type = async (
      id: string,
      text: string,
      setter: (v: string) => void,
      per = 45
    ) => {
      setTyping(id);
      for (let i = 1; i <= text.length; i++) {
        if (cancelled) return;
        setter(text.slice(0, i));
        await wait(per);
      }
    };

    const run = async () => {
      while (!cancelled) {
        // Reset
        setStage("browse");
        setEmail("");
        setCard("");
        setExp("");
        setCvc("");
        setTyping(null);
        setProcessing(false);
        setClicking(false);
        await animate(cursorRef.current!, { opacity: 0 }, { duration: 0 });
        await wait(500);
        if (cancelled) break;

        // Stage 1: customer cursor enters and clicks the product
        const t = center(targetRef.current);
        await animate(
          cursorRef.current!,
          { x: t.x + 30, y: t.y + 50, opacity: 1 },
          { duration: 0 }
        );
        await animate(
          cursorRef.current!,
          { x: t.x, y: t.y },
          { duration: 0.9, ease: "easeInOut" }
        );
        if (cancelled) break;
        await wait(250);
        setClicking(true);
        await animate(
          cursorRef.current!,
          { scale: 0.85 },
          { duration: 0.12 }
        );
        await animate(cursorRef.current!, { scale: 1 }, { duration: 0.12 });
        await wait(180);
        setClicking(false);

        // Stage 2: payment modal opens and fills in
        setStage("pay");
        await animate(cursorRef.current!, { opacity: 0 }, { duration: 0.2 });
        await wait(450); // let the modal mount/animate in
        if (cancelled) break;
        await type("email", EMAIL, setEmail);
        await wait(120);
        await type("card", CARD, setCard, 28);
        await wait(120);
        await type("exp", EXP, setExp);
        await type("cvc", CVC, setCvc);
        setTyping(null);
        await wait(250);
        if (cancelled) break;

        // Cursor returns to click "Pay"
        const pay = center(payRef.current);
        await animate(
          cursorRef.current!,
          { x: pay.x + 24, y: pay.y + 30, opacity: 1 },
          { duration: 0 }
        );
        await animate(
          cursorRef.current!,
          { x: pay.x, y: pay.y },
          { duration: 0.7, ease: "easeInOut" }
        );
        await animate(cursorRef.current!, { scale: 0.85 }, { duration: 0.12 });
        await animate(cursorRef.current!, { scale: 1 }, { duration: 0.12 });
        setProcessing(true);
        await animate(cursorRef.current!, { opacity: 0 }, { duration: 0.25 });
        await wait(900);
        if (cancelled) break;

        // Stage 3: confirmation
        setProcessing(false);
        setStage("confirm");
        await wait(2600);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [inView, reduced, animate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Derived display state so reduced-motion shows the completed sale without
  // running the timeline (avoids cascading setState in the effect).
  const showStage: Stage = reduced ? "confirm" : stage;
  const dEmail = reduced ? EMAIL : email;
  const dCard = reduced ? CARD : card;
  const dExp = reduced ? EXP : exp;
  const dCvc = reduced ? CVC : cvc;

  return (
    <div ref={scope} className="relative mx-auto w-full max-w-sm">
      {/* The store the customer is browsing */}
      <div
        aria-label="A Square Share store embedded on a website"
        role="img"
        className="select-none overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.18)]"
      >
        <div aria-hidden="true">
          <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
            </div>
            <div className="flex h-7 flex-1 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3">
              <Lock size={11} className="shrink-0 text-neutral-400" />
              <span className="truncate text-xs text-neutral-500">
                yourstudio.com
              </span>
            </div>
          </div>
          <div className="px-5 py-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-black tracking-tight text-neutral-900">
                STUDIO
              </span>
              <span className="text-[10px] text-neutral-400">
                Powered by Square Share
              </span>
            </div>
            <div className="aspect-[4/3] w-full">
              <div className="grid h-full grid-cols-4 grid-rows-3 gap-2">
                {STOREFRONT_SLOTS.map((s) => {
                  const isTarget = s.img === CHECKOUT_PRODUCT.img;
                  const style = {
                    gridColumn: `${s.col} / span ${s.cw}`,
                    gridRow: `${s.row} / span ${s.rh}`,
                  };
                  const cls =
                    "relative overflow-hidden rounded-lg border border-neutral-200/70 bg-neutral-100";
                  const inner = (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.img}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      {isTarget && clicking && (
                        <span className="absolute inset-0 rounded-lg ring-2 ring-[#a855f7]" />
                      )}
                    </>
                  );
                  return isTarget ? (
                    <button
                      key={s.id}
                      ref={targetRef}
                      type="button"
                      aria-hidden="true"
                      tabIndex={-1}
                      style={style}
                      className={`${cls} cursor-default`}
                    >
                      {inner}
                    </button>
                  ) : (
                    <div key={s.id} style={style} className={cls}>
                      {inner}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment + confirmation modal */}
      <AnimatePresence>
        {showStage !== "browse" && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/30 p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-[300px] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {showStage === "pay" ? (
                <div className="p-4">
                  {/* Line item */}
                  <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={CHECKOUT_PRODUCT.img}
                      alt=""
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-neutral-900">
                        {CHECKOUT_PRODUCT.name}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        {CHECKOUT_PRODUCT.category}
                      </p>
                    </div>
                    <p className="font-mono text-xs font-bold text-neutral-900">
                      {CHECKOUT_PRODUCT.price}
                    </p>
                  </div>

                  {/* Fields */}
                  <div className="mt-3 flex flex-col gap-2.5">
                    <div>
                      <span className="mb-1 block text-[10px] font-medium text-neutral-500">
                        Email
                      </span>
                      <div className="flex h-8 items-center rounded-lg border border-neutral-200 px-2.5 text-[11px] text-neutral-800">
                        {dEmail || (
                          <span className="text-neutral-400">
                            you@example.com
                          </span>
                        )}
                        <Caret active={typing === "email"} />
                      </div>
                    </div>
                    <div>
                      <span className="mb-1 block text-[10px] font-medium text-neutral-500">
                        Card information
                      </span>
                      <div className="flex h-8 items-center gap-2 rounded-lg border border-neutral-200 px-2.5 text-[11px] text-neutral-800">
                        <CreditCard
                          size={13}
                          className="shrink-0 text-neutral-400"
                        />
                        <span className="tracking-wide">{dCard}</span>
                        <Caret active={typing === "card"} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="flex h-8 items-center rounded-lg border border-neutral-200 px-2.5 text-[11px] text-neutral-800">
                        {dExp || <span className="text-neutral-400">MM / YY</span>}
                        <Caret active={typing === "exp"} />
                      </div>
                      <div className="flex h-8 items-center rounded-lg border border-neutral-200 px-2.5 text-[11px] text-neutral-800">
                        {dCvc ? (
                          <span className="tracking-widest">
                            {"•".repeat(dCvc.length)}
                          </span>
                        ) : (
                          <span className="text-neutral-400">CVC</span>
                        )}
                        <Caret active={typing === "cvc"} />
                      </div>
                    </div>
                  </div>

                  {/* Pay button */}
                  <div
                    ref={payRef}
                    className="mt-4 flex h-10 items-center justify-center rounded-lg bg-neutral-900 text-xs font-semibold text-white"
                  >
                    {processing ? (
                      <span className="flex items-center gap-2">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Processing
                      </span>
                    ) : (
                      <>Pay {CHECKOUT_PRODUCT.price}</>
                    )}
                  </div>
                  <p className="mt-2 flex items-center justify-center gap-1 text-[10px] text-neutral-400">
                    <Lock size={9} />
                    Powered by Stripe
                  </p>
                </div>
              ) : (
                // Confirmation
                <div className="flex flex-col items-center px-5 py-7 text-center">
                  <motion.span
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 320,
                      damping: 18,
                    }}
                  >
                    <Check size={26} strokeWidth={3} />
                  </motion.span>
                  <p className="mt-3 text-sm font-black text-neutral-900">
                    Payment successful
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    {CHECKOUT_PRODUCT.name} is on its way. A receipt was sent to{" "}
                    {EMAIL}.
                  </p>
                  <div className="mt-4 flex w-full items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 text-[11px]">
                    <span className="text-neutral-500">Order #SQ-2048</span>
                    <span className="font-mono font-bold text-neutral-900">
                      {CHECKOUT_PRODUCT.price}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer cursor */}
      <div
        ref={cursorRef}
        style={{ opacity: 0 }}
        className="pointer-events-none absolute left-0 top-0 z-30"
      >
        <CursorPointer label="customer" color={CUSTOMER} />
      </div>
    </div>
  );
}
