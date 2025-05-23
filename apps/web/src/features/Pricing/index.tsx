'use client';

import { Badge, Button, Label, Switch } from '@kudo/ui';
import { cn } from '@/lib/utils';
import NumberFlow from '@number-flow/react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useRef, useState } from 'react';
import { plans } from './plans';
import { Link } from '@/i18n/routing';
import { useIsMobile } from '@/hooks/use-mobile';

interface PricingPlan {
  name: string;
  price?: string;
  yearlyPrice?: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

export function Pricing({
  plans,
  title = 'Start Free, Upgrade Later',
  description = 'Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support.',
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = !useIsMobile();
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))', 'hsl(var(--muted))'],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ['circle'],
      });
    }
  };

  return (
    <div className="w-full mx-auto container pb-20">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl tracking-tight sm:text-5xl">{title}</h2>
        <p className="text-muted-foreground text-lg whitespace-pre-line">{description}</p>
      </div>

      <div className="flex justify-center lg:mb-10">
        <Label className="relative inline-flex items-center cursor-pointer">
          <Switch ref={switchRef} checked={!isMonthly} onCheckedChange={handleToggle} className="relative" />
        </Label>

        <span className="ml-2">
          Annual billing <span className="text-primary">(Save 40%)</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 sm:2 gap-4">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ y: 50, opacity: 1 }}
            whileInView={
              isDesktop
                ? {
                    y: plan.isPopular ? -20 : 0,
                    opacity: 1,
                    x: index === 2 ? -30 : index === 0 ? 30 : 0,
                    scale: index === 0 || index === 2 ? 0.94 : 1.0,
                  }
                : {}
            }
            viewport={{ once: true }}
            transition={{
              duration: 1.6,
              type: 'spring',
              stiffness: 100,
              damping: 30,
              delay: 0.4,
              opacity: { duration: 0.5 },
            }}
            className={cn(
              'rounded border-[1px] p-6 backdrop-blur-md bg-gradient-to-r from-card/20 to-accent text-center lg:flex lg:flex-col lg:justify-center relative',
              plan.isPopular ? 'border-primary border' : 'border-border',
              'flex flex-col',
              !plan.isPopular && 'mt-5',
              index === 0 || index === 2
                ? 'z-0 transform translate-x-0 translate-y-0 -translate-z-[50px] rotate-y-[10deg]'
                : 'z-10',
              index === 0 && 'origin-right',
              index === 2 && 'origin-left',
            )}
          >
            <div className="flex-1 flex flex-col">
              <Badge
                variant={plan.isPopular ? 'default' : 'basic'}
                className="text-left text-base text-xl bg-transparent hover:bg-transparent border-none"
              >
                {plan.name}
              </Badge>
              <div className="mt-6 flex items-center justify-center gap-x-2">
                {!plan.price && <p className="text-5xl">Let's Talk</p>}
                {plan.price && (
                  <span className="text-5xl font-thin tracking-tight text-foreground">
                    <NumberFlow
                      value={isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)}
                      format={{
                        style: 'currency',
                        currency: 'USD',
                      }}
                      transformTiming={{
                        duration: 500,
                        easing: 'ease-out',
                      }}
                      locales="en-US"
                      willChange
                      className="font-variant-numeric: tabular-nums"
                    />
                  </span>
                )}
                {plan.price && plan.period !== 'Next 3 months' && (
                  <span className="text-sm leading-6 tracking-wide text-muted-foreground">/ {plan.period}</span>
                )}
              </div>

              {plan.price && (
                <p className="text-xs leading-5 text-muted-foreground">
                  {isMonthly ? 'billed monthly' : 'billed annually'}
                </p>
              )}

              <ul className="mt-5 gap-2 flex flex-col">
                {plan.features.map((feature, idx) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-left">{feature}</span>
                  </li>
                ))}
              </ul>

              <hr className="w-full my-4" />

              <Button variant={plan.isPopular ? 'default' : 'secondary'} asChild>
                <Link className="w-full" href={plan.href}>
                  {plan.buttonText}
                </Link>
              </Button>
              <p className="mt-6 text-xs leading-5 text-muted-foreground">{plan.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PricingBasic() {
  return (
    <div className="mx-auto w-full overflow-y-auto rounded-lg">
      <Pricing plans={plans} description="You can cancel anytime, no credit card required to start." />
    </div>
  );
}

export { PricingBasic };
