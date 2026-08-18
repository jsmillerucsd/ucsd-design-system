/**
 * The demo page, built from UNMODIFIED shadcn/ui components.
 *
 * Everything under components/ui/ came straight from shadcn's registry (see
 * vendor.mjs) and is not edited. That is the point: if the token bridge works,
 * shadcn's own class strings — `bg-primary`, `border-input`, `text-muted-foreground`
 * — land on UCSD colours with nothing changed. Anything that looks wrong here is a
 * real defect in the bridge.
 *
 * Where a component genuinely needs a UCSD-specific override, it is done at the
 * CALL SITE via className, which tailwind-merge resolves. That is shadcn's own
 * escape hatch and the one docs/using/nextjs.md rule 6 points at. Each such
 * override is annotated below, because the count of them is the honest measure of
 * how drop-in this really is.
 */

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Bell, ChartColumn, CircleAlert, CircleCheck, Info, TriangleAlert,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from './components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { Badge } from './components/ui/badge';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator,
} from './components/ui/breadcrumb';
import { Button } from './components/ui/button';
import { Checkbox } from './components/ui/checkbox';
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from './components/ui/dropdown-menu';
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from './components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';
import { RadioGroup, RadioGroupItem } from './components/ui/radio-group';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from './components/ui/select';
import { Slider } from './components/ui/slider';
import { Switch } from './components/ui/switch';
import { Textarea } from './components/ui/textarea';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from './components/ui/tooltip';
import {
  Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from './components/ui/card';
import {
  ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent,
  type ChartConfig,
} from './components/ui/chart';
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger,
} from './components/ui/dialog';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Progress } from './components/ui/progress';
import { Separator } from './components/ui/separator';
import { Skeleton } from './components/ui/skeleton';
import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,
} from './components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

// ---------------------------------------------------------------------------
// Sample data — INVENTED. Not UCSD figures, and deliberately not shaped to look
// like any. Series names are generic so no number here can be mistaken for a real
// institutional statistic if this page gets screenshotted.
// ---------------------------------------------------------------------------

const CHART_DATA = [
  { period: 'P1', series_a: 186, series_b: 80, series_c: 120 },
  { period: 'P2', series_a: 305, series_b: 200, series_c: 140 },
  { period: 'P3', series_a: 237, series_b: 120, series_c: 190 },
  { period: 'P4', series_a: 173, series_b: 190, series_c: 90 },
  { period: 'P5', series_a: 209, series_b: 130, series_c: 210 },
  { period: 'P6', series_a: 264, series_b: 140, series_c: 160 },
];

// shadcn's charting contract: each series names a CSS variable. Ours resolve to
// --chart-1..5 from the bridge, so the chart is themed by the token layer and
// follows dark mode with no chart-specific code.
const CHART_CONFIG = {
  series_a: { label: 'Series A', color: 'var(--chart-1)' },
  series_b: { label: 'Series B', color: 'var(--chart-2)' },
  series_c: { label: 'Series C', color: 'var(--chart-4)' },
} satisfies ChartConfig;

const ROWS = [
  { id: 'SAMPLE-001', item: 'Sample record one', state: 'Complete', amount: '120' },
  { id: 'SAMPLE-002', item: 'Sample record two', state: 'In review', amount: '80' },
  { id: 'SAMPLE-003', item: 'Sample record three', state: 'Blocked', amount: '45' },
  { id: 'SAMPLE-004', item: 'Sample record four', state: 'Complete', amount: '260' },
];

// ---------------------------------------------------------------------------
// Page furniture
// ---------------------------------------------------------------------------

function Section({
  id, title, lede, children,
}: {
  id: string; title: string; lede?: string; children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mb-xxxl-64">
      <h2 id={id} className="mb-xs-8 text-h2 font-h2 text-foreground-h2-heading">{title}</h2>
      {lede && (
        <p className="mb-md-16 max-w-[--ucsd-container-prose] text-body-md text-muted-foreground">
          {lede}
        </p>
      )}
      {children}
    </section>
  );
}

/** Marks a place where a call-site override was needed, so they stay countable. */
function Override({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-xs-8 text-body-sm text-muted-foreground">
      <strong className="text-foreground-body-text">Override:</strong> {children}
    </p>
  );
}

function Swatch({ className, label }: { className: string; label: string }) {
  return (
    <div className={`rounded-md p-md-16 text-body-sm ${className}`}>{label}</div>
  );
}

// ---------------------------------------------------------------------------

export function Page() {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <>
      <header className="bg-theme-primary text-foreground-heading-light">
        <div className="mx-auto flex max-w-base items-center justify-between px-md-16 py-xs-8">
          <strong>UC San Diego</strong>
          <Button
            variant="outline"
            size="sm"
            aria-pressed={dark}
            onClick={() => setDark((d) => !d)}
            /* Override: `outline` assumes a light page. On the navy masthead it needs
               the inverted border and text; nothing about that is a token defect. */
            className="border-foreground-heading-light bg-transparent text-foreground-heading-light hover:bg-surface-3 hover:text-foreground-heading-light"
          >
            {dark ? 'Light mode' : 'Dark mode'}
          </Button>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-base px-md-16 py-xxxl-64">
        <h1 className="mb-xs-8 text-h1 font-h1 text-foreground-h1-heading">
          shadcn/ui on UCSD tokens
        </h1>
        <p className="mb-xxxl-64 max-w-[--ucsd-container-prose] text-body-md text-muted-foreground">
          Every component below is unmodified shadcn/ui source, vendored from its own
          registry. No component file was edited. Toggle the mode: nothing here carries
          a UCSD <code>dark:</code> class, so if the page follows, the bridge holds.
        </p>

        <Section
          id="s-buttons"
          title="Buttons"
          lede="shadcn's own variants and sizes, untouched. h-9 and px-4 come from its source and land on UCSD spacing because the theme re-points Tailwind's numeric scale."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button>Apply now</Button>
            <Button variant="secondary">Save draft</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            {/* Override: shadcn hardcodes `text-white` on destructive. Our theme drops
                Tailwind's palette, and white would fail contrast on the dark-mode red
                anyway. destructive-foreground is the token that flips correctly. */}
            <Button variant="destructive" className="text-destructive-foreground">
              Withdraw
            </Button>
            <Button disabled>Disabled</Button>
            <Button size="icon" aria-label="Notifications"><Bell /></Button>
          </div>
          <Override>
            <code>text-white</code> on the destructive variant — see the comment in{' '}
            <code>app.tsx</code>. The vendored set hardcodes a literal palette colour in
            exactly three places: here, the destructive badge, and the slider thumb's{' '}
            <code>bg-white</code>. Everything else resolves through the bridge.
          </Override>
        </Section>

        <Section
          id="s-alerts"
          title="Alert notifications"
          lede="shadcn ships default and destructive only. The four UCSD system pairs are applied at the call site, which is what a product team would do."
        >
          <div className="grid max-w-narrow gap-3">
            <Alert>
              <Info />
              <AlertTitle>Registration opens 12 August</AlertTitle>
              <AlertDescription>
                Unmodified default variant — card surface, border, muted description.
              </AlertDescription>
            </Alert>

            <Alert className="border-system-success bg-system-bg-success text-system-foreground-success [&>svg]:text-system-foreground-success">
              <CircleCheck />
              <AlertTitle>Your form was submitted</AlertTitle>
              <AlertDescription className="text-system-foreground-success">
                system.bg-success with system.foreground-success, used as the pair.
              </AlertDescription>
            </Alert>

            <Alert className="border-system-warning bg-system-bg-warning text-system-foreground-warning [&>svg]:text-system-foreground-warning">
              <TriangleAlert />
              <AlertTitle>Review your selections</AlertTitle>
              <AlertDescription className="text-system-foreground-warning">
                Icon and text both carry the message — never colour alone.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <CircleAlert />
              <AlertTitle>We could not verify your student ID</AlertTitle>
              <AlertDescription>
                Unmodified destructive variant, resolving through system.error.
              </AlertDescription>
            </Alert>
          </div>
          <Override>
            Success and warning are call-site classes because shadcn has no such
            variants. Both use the <code>bg-</code>/<code>foreground-</code> pair, which
            is what keeps them legible in dark mode.
          </Override>
        </Section>

        <Section
          id="s-cards"
          title="Cards"
          lede="Surface, border and a padding contract — no drop shadow, which is what DESIGN.md asks for and what shadcn's card already does."
        >
          <div className="grid gap-md-16 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Financial aid status</CardTitle>
                <CardDescription>Updated 5 August 2026</CardDescription>
                <CardAction><Badge variant="secondary">Sample</Badge></CardAction>
              </CardHeader>
              <CardContent className="grid gap-sm-12">
                <p className="text-body-md">
                  Every class in this card is shadcn's. The surface, border colour and
                  muted description text all resolve to UCSD semantic tokens.
                </p>
                <div className="grid gap-xxs-4">
                  <div className="flex justify-between text-body-sm">
                    <span>Sample progress</span>
                    <span className="text-muted-foreground">62%</span>
                  </div>
                  <Progress value={62} />
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button>View award letter</Button>
                <Button variant="outline">Cancel</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loading state</CardTitle>
                <CardDescription>Skeleton, avatar and separator</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-sm-12">
                <div className="flex items-center gap-3">
                  <Avatar><AvatarFallback>UC</AvatarFallback></Avatar>
                  <div className="grid gap-xxs-4">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
                <Separator />
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          id="s-chart"
          title="Chart"
          lede="Recharts through shadcn's ChartContainer. The series colours are --chart-1/2/4 from the bridge, so the chart re-themes with the page and needs no chart-specific dark-mode code. All figures are invented placeholders."
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartColumn className="size-4" /> Sample series
              </CardTitle>
              <CardDescription>Placeholder data — not UCSD figures</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={CHART_CONFIG} className="h-[300px] w-full">
                <BarChart accessibilityLayer data={CHART_DATA}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="period" tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis tickLine={false} axisLine={false} width={40} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="series_a" fill="var(--color-series_a)" radius={4} />
                  <Bar dataKey="series_b" fill="var(--color-series_b)" radius={4} />
                  <Bar dataKey="series_c" fill="var(--color-series_c)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </Section>

        <Section
          id="s-data"
          title="Tabs, table and dialog"
          lede="Radix primitives underneath, so keyboard handling and ARIA come for free. Try arrow keys on the tabs and Escape in the dialog."
        >
          <Tabs defaultValue="records">
            <TabsList>
              <TabsTrigger value="records">Records</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="records" className="mt-md-16">
              <Card>
                <CardContent>
                  <Table>
                    <TableCaption>Sample records — invented data.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reference</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ROWS.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">{row.id}</TableCell>
                          <TableCell>{row.item}</TableCell>
                          <TableCell>
                            {/* Override: same `text-white` as the destructive button —
                                shadcn hardcodes it in both variants. */}
                            <Badge
                              variant={row.state === 'Blocked' ? 'destructive' : 'secondary'}
                              className={row.state === 'Blocked' ? 'text-destructive-foreground' : ''}
                            >
                              {row.state}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{row.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex-wrap justify-between gap-sm-12">
                  <Pagination className="mx-0 w-auto justify-start">
                    <PaginationContent>
                      <PaginationItem><PaginationPrevious href="#s-data" /></PaginationItem>
                      <PaginationItem><PaginationLink href="#s-data" isActive>1</PaginationLink></PaginationItem>
                      <PaginationItem><PaginationLink href="#s-data">2</PaginationLink></PaginationItem>
                      <PaginationItem><PaginationEllipsis /></PaginationItem>
                      <PaginationItem><PaginationNext href="#s-data" /></PaginationItem>
                    </PaginationContent>
                  </Pagination>
                  <Dialog>
                    <DialogTrigger asChild><Button>Add a record</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add a record</DialogTitle>
                        <DialogDescription>
                          Overlay, surface, border and focus ring all from the bridge.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-sm-12">
                        <div className="grid gap-xxs-4">
                          <Label htmlFor="ref">Reference</Label>
                          <Input id="ref" placeholder="SAMPLE-005" />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <Button>Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="mt-md-16">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                  <CardDescription>Placeholder totals — invented data</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-sm-12 sm:grid-cols-3">
                  {[['Records', '4'], ['Complete', '2'], ['Blocked', '1']].map(([k, v]) => (
                    <div key={k} className="rounded-md border border-border p-md-16">
                      <p className="text-body-sm text-muted-foreground">{k}</p>
                      <p className="text-h2 font-h2 text-foreground-h2-heading">{v}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Section>

        <Section
          id="s-form"
          title="Form controls"
          lede="Kept out of the tabs on purpose: a visitor should not have to click to see them, and Radix only mounts the active tab, so anything parked in an inactive one is invisible to a first paint and to any check that reads the rendered page."
        >
          <Card>
            <CardHeader>
              <CardTitle>Application details</CardTitle>
              <CardDescription>
                Visible persistent labels; errors in text, next to the field.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid max-w-narrow gap-md-16">
              <div className="grid gap-xxs-4">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" placeholder="you@ucsd.edu"
                  aria-describedby="email-help" />
                <p id="email-help" className="text-body-sm text-muted-foreground">
                  Only used for application updates.
                </p>
              </div>
              <div className="grid gap-xxs-4">
                <Label htmlFor="sid">Student ID</Label>
                <Input id="sid" defaultValue="A0000" aria-invalid
                  aria-describedby="sid-error" />
                {/* Override: shadcn styles the invalid BORDER via aria-invalid but
                    leaves the message to the consumer. Colour alone never carries the
                    error, so the text is required, not decorative. */}
                <p id="sid-error" className="text-body-sm text-system-foreground-error">
                  Enter a valid nine-character student ID.
                </p>
              </div>

              <div className="grid gap-xxs-4">
                <Label htmlFor="term">Starting term</Label>
                <Select defaultValue="fall">
                  <SelectTrigger id="term" className="w-full">
                    <SelectValue placeholder="Choose a term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fall">Fall 2026</SelectItem>
                    <SelectItem value="winter">Winter 2027</SelectItem>
                    <SelectItem value="spring">Spring 2027</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <fieldset className="grid gap-xs-8">
                <legend className="text-body-sm font-medium">Enrollment</legend>
                <RadioGroup defaultValue="full" className="gap-xs-8">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="full" id="enroll-full" />
                    <Label htmlFor="enroll-full">Full-time</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="part" id="enroll-part" />
                    <Label htmlFor="enroll-part">Part-time</Label>
                  </div>
                </RadioGroup>
              </fieldset>

              <div className="grid gap-xxs-4">
                <div className="flex justify-between text-body-sm">
                  <Label htmlFor="units">Planned units</Label>
                  <span className="text-muted-foreground">12</span>
                </div>
                {/* Override: shadcn hardcodes `bg-white` on the slider thumb —
                    the same class of defect as `text-white` on destructive. Our
                    theme drops Tailwind's palette, and a literal white thumb
                    would vanish in dark mode anyway; bg-background flips. */}
                <Slider id="units" defaultValue={[12]} max={22} step={1}
                  aria-label="Planned units"
                  className="[&_[data-slot=slider-thumb]]:bg-background" />
              </div>

              <div className="grid gap-xxs-4">
                <Label htmlFor="statement">Personal statement</Label>
                <Textarea id="statement" placeholder="A few sentences about your goals."
                  aria-describedby="statement-help" />
                <p id="statement-help" className="text-body-sm text-muted-foreground">
                  Optional at this stage.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms">I confirm the information above is accurate</Label>
              </div>

              <div className="flex items-center justify-between rounded-md border border-border p-sm-12">
                <Label htmlFor="updates" className="grid gap-xxs-4">
                  Email me application updates
                  <span className="text-body-sm font-normal text-muted-foreground">
                    Sent from the admissions office only.
                  </span>
                </Label>
                <Switch id="updates" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section
          id="s-accordion"
          title="Accordion"
          lede="Radix disclosure underneath — arrow keys, Home and End all work. The divider and muted body text come from the bridge."
        >
          <Accordion type="single" collapsible defaultValue="a-1"
            className="max-w-narrow">
            <AccordionItem value="a-1">
              <AccordionTrigger>When does registration open?</AccordionTrigger>
              <AccordionContent>
                Placeholder answer — registration dates are announced each term on the
                enrollment calendar.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="a-2">
              <AccordionTrigger>Can I change my starting term?</AccordionTrigger>
              <AccordionContent>
                Placeholder answer — starting terms can be deferred once before the
                statement of intent deadline.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="a-3">
              <AccordionTrigger>Who can I contact for help?</AccordionTrigger>
              <AccordionContent>
                Placeholder answer — the admissions office handles application
                questions; financial aid has its own contact form.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Section>

        <Section
          id="s-overlays"
          title="Wayfinding and overlays"
          lede="Breadcrumb, dropdown menu, popover and tooltip. The floating surfaces share the popover slot pair, so all of them re-theme together in dark mode."
        >
          <Card>
            <CardContent className="grid gap-md-16">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#main">Admissions</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#main">Undergraduate</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Application</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex flex-wrap items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Actions</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>This application</DropdownMenuLabel>
                    <DropdownMenuItem>Download PDF</DropdownMenuItem>
                    <DropdownMenuItem>Share with advisor</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Email updates
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      Withdraw application
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">What counts as full-time?</Button>
                  </PopoverTrigger>
                  <PopoverContent className="text-body-sm">
                    Placeholder definition — full-time enrollment is twelve or more
                    units in a term. The surface and border here are the popover slot
                    pair from the bridge.
                  </PopoverContent>
                </Popover>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="About deadlines">
                        <Info />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Deadlines are 11:59pm Pacific.</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section
          id="s-swatches"
          title="Semantic colours"
          lede="The tokens everything above resolves to. Every swatch must move with the toggle; one that doesn't is hard-coded somewhere."
        >
          <div className="mb-md-16 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Swatch className="border border-border bg-surface-1 text-foreground-body-text" label="surface-1 / body-text" />
            <Swatch className="border border-border bg-surface-2 text-component-menu" label="surface-2 / menu" />
            <Swatch className="bg-surface-3 text-foreground-heading-light" label="surface-3 / heading-light" />
            <Swatch className="bg-surface-4 text-foreground-heading-light" label="surface-4 / heading-light" />
            <Swatch className="bg-theme-primary text-foreground-heading-light" label="theme-primary" />
            <Swatch className="bg-theme-secondary text-foreground-heading-light" label="theme-secondary" />
            <Swatch className="bg-theme-accent text-component-btn-label-primary" label="theme-accent" />
            <Swatch className="border border-border bg-surface-5 text-foreground-body-text" label="surface-5 / body-text" />
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Swatch className="bg-system-bg-success text-system-foreground-success" label="bg/fg success" />
            <Swatch className="bg-system-bg-warning text-system-foreground-warning" label="bg/fg warning" />
            <Swatch className="bg-system-bg-error text-system-foreground-error" label="bg/fg error" />
            <Swatch className="bg-system-bg-information text-system-foreground-information" label="bg/fg information" />
          </div>
        </Section>

        <Section
          id="s-type"
          title="Typography"
          lede="One class per role — text-h1 carries size, line-height and weight together. Until the Brix Sans and Refrigerator Deluxe web licences are confirmed these render from the fallback stacks, which is what a visitor sees today."
        >
          <div className="grid gap-sm-12">
            <p className="text-eyebrow font-eyebrow text-foreground-eyebrow">EYEBROW — Refrigerator Deluxe</p>
            <p className="text-h1 font-h1 text-foreground-h1-heading">H1 heading — Refrigerator Deluxe</p>
            <p className="text-h2 font-h2 text-foreground-h2-heading">H2 heading — Brix Sans</p>
            <p className="text-h3 font-h3 text-foreground-h3-heading">H3 heading — Refrigerator Deluxe</p>
            <p className="text-subheading font-subheading text-foreground-subheading">Subheading — Brix Sans</p>
            <p className="text-body-lg font-body text-foreground-body-text">Body large — lead paragraphs.</p>
            <p className="text-body-md font-body text-foreground-body-text">Body medium — sustained prose.</p>
            <p className="text-body-sm font-body text-foreground-body-text">Body small — help text and captions.</p>
          </div>
        </Section>
      </main>

      <footer className="bg-theme-secondary text-foreground-heading-light">
        <div className="mx-auto max-w-base px-md-16 py-xxxl-64 text-center text-body-md">
          UCSD Design System — unmodified shadcn/ui on @ucsd/tokens
        </div>
      </footer>
    </>
  );
}

// Guarded so the module can also be imported by test/demo-render.test.mjs, which
// renders <Page /> to a string and checks every class it emits actually compiles.
if (typeof document !== 'undefined') {
  createRoot(document.getElementById('root')!).render(<Page />);
}
