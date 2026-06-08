import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Sun, Moon, LayoutDashboard, Layers,
  BarChart3, ShoppingCart, Users, Settings,
  Bell, Search, TrendingUp, TrendingDown,
  ArrowUpRight, Package, ChevronRight,
  Home, FileText, CreditCard,
  Mail, Lock, AtSign, Phone,
} from 'lucide-react';
import { useBrandStore } from '@/store/brandStore';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '@/components/ui/card';
import type { TokenMode, Collection } from '@/types/token';

function buildStyleVars(collections: Collection[], mode: TokenMode): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const col of collections) {
    for (const token of col.tokens) {
      const val = token.values[mode] ?? token.values['default'];
      if (!val?.raw) continue;
      vars[token.cssVariable] = val.raw;
      // Tailwind v4 @theme inline maps --color-X → var(--X), so bg-primary resolves
      // to var(--primary), not var(--color-primary). We must emit both so Tailwind
      // utilities pick up the brand token value instead of the app's :root default.
      if (token.cssVariable.startsWith('--color-')) {
        vars[`--${token.cssVariable.slice('--color-'.length)}`] = val.raw;
      }
    }
  }
  return vars;
}

// ─── Dashboard Preview ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: Home, label: 'Dashboard', active: true },
  { icon: BarChart3, label: 'Analytics', active: false },
  { icon: ShoppingCart, label: 'Orders', badge: '12', active: false },
  { icon: Package, label: 'Products', active: false },
  { icon: Users, label: 'Customers', active: false },
  { icon: FileText, label: 'Reports', active: false },
  { icon: CreditCard, label: 'Billing', active: false },
];

const STATS = [
  { label: 'Total Revenue', value: '$48,295', delta: '+12.5%', up: true, icon: TrendingUp },
  { label: 'New Orders', value: '1,840', delta: '+8.2%', up: true, icon: ShoppingCart },
  { label: 'Active Users', value: '24,521', delta: '-2.1%', up: false, icon: Users },
  { label: 'Conversion', value: '3.6%', delta: '+0.4%', up: true, icon: BarChart3 },
];

const ORDERS = [
  { id: '#ORD-001', customer: 'Alex Johnson', product: 'Pro Plan', amount: '$299', status: 'Paid' },
  { id: '#ORD-002', customer: 'Maria Garcia', product: 'Starter', amount: '$49', status: 'Pending' },
  { id: '#ORD-003', customer: 'Sam Lee', product: 'Enterprise', amount: '$999', status: 'Paid' },
  { id: '#ORD-004', customer: 'Jordan Kim', product: 'Pro Plan', amount: '$299', status: 'Failed' },
  { id: '#ORD-005', customer: 'Casey Brown', product: 'Starter', amount: '$49', status: 'Paid' },
];

function DashboardPreview({ brandName, brandFont, isDark }: { brandName: string; brandFont?: string; isDark: boolean }) {
  const fontStyle = brandFont ? { fontFamily: `'${brandFont}', sans-serif` } : {};

  const statusColor = (s: string) => {
    if (s === 'Paid') return 'var(--color-primary)';
    if (s === 'Pending') return 'var(--color-secondary)';
    return 'var(--color-destructive, #ef4444)';
  };

  return (
    <div
      className={cn('dtb-dashboard flex h-full rounded-xl overflow-hidden border', isDark && 'dark')}
      style={{
        ...fontStyle,
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-foreground)',
        minHeight: 600,
      } as React.CSSProperties}
    >
      {/* Scoped interactive styles — vars resolve from .dtb-dashboard which carries the dark class */}
      <style>{`
        .dtb-dashboard .db-nav-btn { background: transparent; border: 0; width: 100%; text-align: left; }
        .dtb-dashboard .db-nav-btn:not([data-active]):hover {
          background-color: var(--color-sidebar-accent, var(--color-muted)) !important;
          color: var(--color-sidebar-accent-foreground, var(--color-muted-foreground)) !important;
        }
        .dtb-dashboard .db-nav-btn:focus-visible {
          outline: 2px solid var(--color-sidebar-ring, var(--color-ring, var(--color-primary)));
          outline-offset: 2px;
        }
        .dtb-dashboard .db-action-btn { background: transparent; border: 0; padding: 0; cursor: pointer; }
        .dtb-dashboard .db-action-btn:hover { opacity: 0.82; }
        .dtb-dashboard .db-action-btn:focus-visible {
          outline: 2px solid var(--color-ring, var(--color-primary));
          outline-offset: 2px;
          border-radius: 4px;
        }
        .dtb-dashboard .db-table-row:hover { background-color: var(--color-muted, rgba(0,0,0,0.04)) !important; }
        .dtb-dashboard .db-table-row:focus-visible {
          outline: 2px solid var(--color-ring, var(--color-primary));
          outline-offset: -2px;
        }
      `}</style>
      {/* Sidebar */}
      <aside
        className="flex flex-col shrink-0"
        style={{
          width: 220,
          backgroundColor: 'var(--color-sidebar, var(--color-card, var(--color-background)))',
          color: 'var(--color-sidebar-foreground, var(--color-foreground))',
          borderRight: '1px solid var(--color-sidebar-border, var(--color-border))',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--color-sidebar-border, var(--color-border))' }}>
          <div
            className="size-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm"
            style={{ backgroundColor: 'var(--color-sidebar-primary, var(--color-primary))', color: 'var(--color-sidebar-primary-foreground, var(--color-primary-foreground, #fff))' }}
          >
            {brandName.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-sm truncate">{brandName}</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 p-3 flex-1 overflow-auto">
          <p className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-1 mt-1"
            style={{ color: 'var(--color-sidebar-accent-foreground, var(--color-muted-foreground))' }}>
            Menu
          </p>
          {NAV_ITEMS.map(({ icon: Icon, label, active, badge }) => (
            <button
              key={label}
              type="button"
              data-active={active || undefined}
              className="db-nav-btn flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm select-none transition-colors"
              style={{
                backgroundColor: active ? 'var(--color-sidebar-primary, var(--color-primary))' : 'transparent',
                color: active
                  ? 'var(--color-sidebar-primary-foreground, var(--color-primary-foreground, #fff))'
                  : 'var(--color-sidebar-accent-foreground, var(--color-muted-foreground))',
                fontWeight: active ? 600 : 400,
              }}
            >
              <Icon className="size-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {badge && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: active
                      ? 'var(--color-sidebar-primary-foreground, var(--color-primary-foreground, #fff))'
                      : 'var(--color-sidebar-primary, var(--color-primary))',
                    color: active
                      ? 'var(--color-sidebar-primary, var(--color-primary))'
                      : 'var(--color-sidebar-primary-foreground, var(--color-primary-foreground, #fff))',
                  }}
                >
                  {badge}
                </span>
              )}
            </button>
          ))}

          <div className="mt-auto pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-1"
              style={{ color: 'var(--color-sidebar-accent-foreground, var(--color-muted-foreground))' }}>
              System
            </p>
            <button type="button" className="db-nav-btn flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors"
              style={{ color: 'var(--color-sidebar-accent-foreground, var(--color-muted-foreground))' }}>
              <Settings className="size-4 shrink-0" />
              <span>Settings</span>
            </button>
          </div>
        </nav>

        {/* User */}
        <div
          className="flex items-center gap-2.5 px-4 py-3 shrink-0"
          style={{ borderTop: '1px solid var(--color-sidebar-border, var(--color-border))' }}
        >
          <div
            className="size-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
            style={{ backgroundColor: 'var(--color-sidebar-accent, var(--color-muted))', color: 'var(--color-sidebar-accent-foreground, var(--color-muted-foreground))' }}
          >
            AJ
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">Alex Johnson</p>
            <p className="text-[10px] truncate" style={{ color: 'var(--color-sidebar-accent-foreground, var(--color-muted-foreground))' }}>
              admin@company.com
            </p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center gap-3 px-5 py-3 shrink-0"
          style={{
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card, var(--color-background))',
          }}
        >
          <div className="flex-1">
            <h1 className="text-base font-semibold">Dashboard</h1>
            <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
              Welcome back, Alex
            </p>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs"
            style={{
              backgroundColor: 'var(--color-muted)',
              color: 'var(--color-muted-foreground)',
              border: '1px solid var(--color-border)',
              width: 160,
            }}
          >
            <Search className="size-3 shrink-0" />
            <span>Search…</span>
          </div>
          <div
            className="relative size-8 flex items-center justify-center rounded-md cursor-pointer"
            style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}
          >
            <Bell className="size-4" />
            <span
              className="absolute top-1 right-1 size-2 rounded-full"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
          </div>
          <div
            className="size-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground, #fff)' }}
          >
            AJ
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5 space-y-5">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {STATS.map(({ label, value, delta, up, icon: Icon }) => (
              <div
                key={label}
                className="rounded-lg p-4 space-y-2"
                style={{
                  backgroundColor: 'var(--color-card, var(--color-background))',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{label}</p>
                  <div
                    className="size-7 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-muted)' }}
                  >
                    <Icon className="size-3.5" style={{ color: 'var(--color-primary)' }} />
                  </div>
                </div>
                <p className="text-lg font-bold">{value}</p>
                <div className="flex items-center gap-1">
                  {up ? (
                    <TrendingUp className="size-3" style={{ color: 'var(--color-primary)' }} />
                  ) : (
                    <TrendingDown className="size-3 text-destructive" />
                  )}
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: up ? 'var(--color-primary)' : 'var(--color-destructive, #ef4444)' }}
                  >
                    {delta}
                  </span>
                  <span className="text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>
                    vs last month
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Lower row */}
          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 280px' }}>
            {/* Orders table */}
            <div
              className="rounded-lg overflow-hidden"
              style={{
                backgroundColor: 'var(--color-card, var(--color-background))',
                border: '1px solid var(--color-border)',
              }}
            >
              <div className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '1px solid var(--color-border)' }}>
                <p className="text-sm font-semibold">Recent Orders</p>
                <button
                  type="button"
                  className="db-action-btn flex items-center gap-1 text-xs font-medium"
                  style={{ color: 'var(--color-primary)' }}
                >
                  View all <ArrowUpRight className="size-3" />
                </button>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {['Order', 'Customer', 'Product', 'Amount', 'Status'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-2.5 font-medium"
                        style={{ color: 'var(--color-muted-foreground)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ORDERS.map((order, i) => (
                    <tr
                      key={order.id}
                      tabIndex={0}
                      className="db-table-row"
                      style={{
                        borderBottom: i < ORDERS.length - 1 ? '1px solid var(--color-border)' : undefined,
                      }}
                    >
                      <td className="px-4 py-2.5 font-mono"
                        style={{ color: 'var(--color-muted-foreground)' }}>
                        {order.id}
                      </td>
                      <td className="px-4 py-2.5 font-medium">{order.customer}</td>
                      <td className="px-4 py-2.5" style={{ color: 'var(--color-muted-foreground)' }}>
                        {order.product}
                      </td>
                      <td className="px-4 py-2.5 font-medium">{order.amount}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{
                            backgroundColor: `color-mix(in srgb, ${statusColor(order.status)} 15%, transparent)`,
                            color: statusColor(order.status),
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick stats card */}
            <div
              className="rounded-lg p-4 space-y-4"
              style={{
                backgroundColor: 'var(--color-card, var(--color-background))',
                border: '1px solid var(--color-border)',
              }}
            >
              <p className="text-sm font-semibold">Quick Stats</p>

              {/* Mini bar chart */}
              <div className="space-y-2">
                {[
                  { label: 'Website', pct: 68 },
                  { label: 'Mobile', pct: 45 },
                  { label: 'API', pct: 28 },
                  { label: 'CLI', pct: 15 },
                ].map(({ label, pct }) => (
                  <div key={label} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span style={{ color: 'var(--color-muted-foreground)' }}>{label}</span>
                      <span className="font-medium">{pct}%</span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'var(--color-muted)' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: 'var(--color-primary)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Separator style={{ backgroundColor: 'var(--color-border)' }} />

              {/* Metric list */}
              <div className="space-y-2.5">
                {[
                  { label: 'Avg. Session', value: '4m 32s' },
                  { label: 'Bounce Rate', value: '38.2%' },
                  { label: 'Page Views', value: '142,890' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                      {label}
                    </span>
                    <span className="text-xs font-semibold">{value}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="db-action-btn flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium w-full"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-foreground, #fff)',
                }}
              >
                <BarChart3 className="size-3.5" />
                Full Report
                <ChevronRight className="size-3.5 ml-auto" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Input Fields section ─────────────────────────────────────────────────────

function InputFieldsPreview() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-5 max-w-2xl">
      {/* Default */}
      <div className="space-y-1.5">
        <Label>Default</Label>
        <Input placeholder="Placeholder text" />
      </div>

      {/* Filled */}
      <div className="space-y-1.5">
        <Label>With value</Label>
        <Input defaultValue="john.doe@example.com" readOnly />
      </div>

      {/* With icon (InputGroup inline-start) */}
      <div className="space-y-1.5">
        <Label>With leading icon</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText><Mail className="size-4" /></InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="you@example.com" />
        </InputGroup>
      </div>

      {/* With trailing icon */}
      <div className="space-y-1.5">
        <Label>With trailing icon</Label>
        <InputGroup>
          <InputGroupAddon align="inline-end">
            <InputGroupText><Phone className="size-4" /></InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="+1 (555) 000-0000" />
        </InputGroup>
      </div>

      {/* Disabled */}
      <div className="space-y-1.5">
        <Label>Disabled</Label>
        <Input placeholder="Not editable" disabled />
      </div>

      {/* Error */}
      <div className="space-y-1.5">
        <Label className="text-destructive">Error state</Label>
        <Input
          defaultValue="bad-email"
          aria-invalid="true"
          className="border-destructive focus-visible:ring-destructive/20"
        />
        <p className="text-destructive text-xs">Please enter a valid email address.</p>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label>Password</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText><Lock className="size-4" /></InputGroupText>
          </InputGroupAddon>
          <InputGroupInput type="password" defaultValue="secret123" />
        </InputGroup>
      </div>

      {/* Search */}
      <div className="space-y-1.5">
        <Label>Search</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText><Search className="size-4" /></InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="Search tokens…" />
        </InputGroup>
      </div>

      {/* Select */}
      <div className="space-y-1.5">
        <Label>Select</Label>
        <Select defaultValue="designer">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="designer">Designer</SelectItem>
            <SelectItem value="engineer">Engineer</SelectItem>
            <SelectItem value="pm">Product Manager</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Textarea */}
      <div className="space-y-1.5 col-span-2">
        <Label>Textarea</Label>
        <Textarea placeholder="Write your message here…" rows={3} />
        <p className="text-muted-foreground text-xs">Max 500 characters.</p>
      </div>
    </div>
  );
}

// ─── Form section ─────────────────────────────────────────────────────────────

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  role: z.string({ message: 'Please select a role' }),
  notifications: z.enum(['all', 'important', 'none']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  terms: z.boolean().refine((v) => v === true, { message: 'You must accept the terms' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

function FormPreview() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: '',
      notifications: 'important',
      message: '',
      terms: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="space-y-5 max-w-md">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Alex Johnson" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <InputGroupText><AtSign className="size-4" /></InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput type="email" placeholder="you@example.com" {...field} />
                </InputGroup>
              </FormControl>
              <FormDescription>We'll never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="engineer">Engineer</SelectItem>
                  <SelectItem value="pm">Product Manager</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notifications */}
        <FormField
          control={form.control}
          name="notifications"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Notifications</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col gap-2"
                >
                  {[
                    { value: 'all', label: 'All notifications' },
                    { value: 'important', label: 'Important only' },
                    { value: 'none', label: 'None' },
                  ].map(({ value, label }) => (
                    <div key={value} className="flex items-center gap-2">
                      <RadioGroupItem value={value} id={`notif-${value}`} />
                      <Label htmlFor={`notif-${value}`} className="font-normal cursor-pointer">{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about your project…" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Terms */}
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex items-start gap-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="terms-checkbox"
                />
              </FormControl>
              <div className="grid gap-0.5">
                <Label htmlFor="terms-checkbox" className="font-normal cursor-pointer leading-snug">
                  I agree to the{' '}
                  <span className="text-primary underline underline-offset-2 cursor-pointer">
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span className="text-primary underline underline-offset-2 cursor-pointer">
                    Privacy Policy
                  </span>
                </Label>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <Button type="submit">Submit</Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}

// ─── Data Table section ───────────────────────────────────────────────────────

const TABLE_ROWS = [
  { name: 'Alex Johnson', email: 'alex@example.com', role: 'Designer', status: 'Active', joined: 'Jan 12, 2024' },
  { name: 'Maria Garcia', email: 'maria@example.com', role: 'Engineer', status: 'Active', joined: 'Feb 3, 2024' },
  { name: 'Sam Lee', email: 'sam@example.com', role: 'PM', status: 'Inactive', joined: 'Mar 18, 2024' },
  { name: 'Jordan Kim', email: 'jordan@example.com', role: 'Designer', status: 'Suspended', joined: 'Apr 5, 2024' },
  { name: 'Casey Brown', email: 'casey@example.com', role: 'Engineer', status: 'Active', joined: 'May 22, 2024' },
  { name: 'Taylor Nguyen', email: 'taylor@example.com', role: 'PM', status: 'Inactive', joined: 'Jun 8, 2024' },
];

const statusVariant = (s: string) =>
  s === 'Active' ? 'default' : s === 'Inactive' ? 'outline' : 'destructive';

function DataTablePreview() {
  return (
    <div className="rounded-md border border-border overflow-hidden max-w-2xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {TABLE_ROWS.map((row) => (
            <TableRow key={row.email} className="hover:bg-muted/50">
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell className="text-muted-foreground">{row.email}</TableCell>
              <TableCell>{row.role}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(row.status)} className="text-xs">
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{row.joined}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Components section helper ────────────────────────────────────────────────

function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0">
          {title}
        </p>
        <Separator />
      </div>
      {children}
    </div>
  );
}

export function PreviewPanel() {
  const { brands, activeBrandId } = useBrandStore();
  const brand = brands.find((b) => b.id === activeBrandId);
  const collections = brand?.collections ?? [];
  const brandFont = brand?.typography?.fontFamily;
  const { previewMode, setPreviewMode } = useUIStore();
  const [previewView, setPreviewView] = useState<'components' | 'dashboard'>('dashboard');

  const styleVars = buildStyleVars(collections, previewMode);

  // Brand color scale — include all shades that exist in the collection
  const primaryShade = brand?.primaryColorShade;
  const paletteShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
  const palette = paletteShades.filter((shade) =>
    collections.some((col) => col.tokens.some((t) => t.cssVariable === `--color-primary-${shade}`)),
  );

  const typo = brand?.typography;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border shrink-0">
        {/* View switcher */}
        <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
          {([
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'components', label: 'Components', icon: Layers },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPreviewView(id)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors',
                previewView === id
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="size-3" />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 ml-auto">
          {(['light', 'dark'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setPreviewMode(m)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border transition-colors',
                previewMode === m
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:bg-muted',
              )}
            >
              {m === 'light' ? <Sun className="size-3" /> : <Moon className="size-3" />}
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <ScrollArea className="flex-1 min-h-0">
        <div
          className={cn('dtb-preview', previewMode === 'dark' && 'dark', previewView === 'dashboard' ? 'p-4' : 'p-6')}
          style={{
            ...styleVars,
            backgroundColor: previewView === 'dashboard' ? 'var(--color-muted, var(--color-background))' : 'var(--color-background)',
            color: 'var(--color-foreground)',
            fontFamily: brandFont ? `'${brandFont}', sans-serif` : undefined,
            minHeight: '100%',
          } as React.CSSProperties}
        >
          {previewView === 'dashboard' ? (
            <DashboardPreview
              brandName={brand?.name ?? 'Brand'}
              brandFont={brandFont}
              isDark={previewMode === 'dark'}
            />
          ) : (
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Brand indicator */}
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  {brand?.name?.charAt(0).toUpperCase() ?? 'B'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-sm">{brand?.name ?? 'Brand'}</p>
                <p className="text-xs text-muted-foreground">
                  {previewMode} mode · shadcn/ui components
                </p>
              </div>
            </div>

            {/* Buttons */}
            <PreviewSection title="Buttons">
              <div className="flex flex-wrap gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button size="sm" variant="outline">Outline SM</Button>
                <Button disabled>Disabled</Button>
                <Button variant="outline" size="sm" disabled>Disabled Outline</Button>
              </div>
            </PreviewSection>

            {/* Badges */}
            <PreviewSection title="Badges">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </PreviewSection>

            {/* Input Fields */}
            <PreviewSection title="Input Field">
              <InputFieldsPreview />
            </PreviewSection>

            {/* Form */}
            <PreviewSection title="Form">
              <FormPreview />
            </PreviewSection>

            {/* Data Table */}
            <PreviewSection title="Data Table">
              <DataTablePreview />
            </PreviewSection>

            {/* Toggles */}
            <PreviewSection title="Toggles">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch defaultChecked id="sw1" />
                  <Label htmlFor="sw1">Enable notifications</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="sw2" />
                  <Label htmlFor="sw2">Marketing emails</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch disabled defaultChecked id="sw3" />
                  <Label htmlFor="sw3" className="text-muted-foreground">Disabled on</Label>
                </div>
              </div>
            </PreviewSection>

            {/* Card */}
            <PreviewSection title="Card">
              <Card className="max-w-sm">
                <CardHeader>
                  <CardTitle>Brand Settings</CardTitle>
                  <CardDescription>
                    Manage your brand tokens and design preferences.
                  </CardDescription>
                  <CardAction>
                    <Badge>New</Badge>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    <Label>Brand Name</Label>
                    <Input placeholder={brand?.name ?? 'My Brand'} />
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button>Save changes</Button>
                  <Button variant="ghost">Cancel</Button>
                </CardFooter>
              </Card>
            </PreviewSection>

            {/* Typography */}
            {typo && (
              <PreviewSection title="Typography">
                <div className="space-y-4">
                  {typo.h1 && (
                    <div
                      style={{
                        fontSize: typo.h1.fontSize,
                        fontWeight: typo.h1.fontWeight,
                        lineHeight: typo.h1.lineHeight,
                        letterSpacing: typo.h1.letterSpacing,
                      }}
                    >
                      Heading 1
                    </div>
                  )}
                  {typo.h2 && (
                    <div
                      style={{
                        fontSize: typo.h2.fontSize,
                        fontWeight: typo.h2.fontWeight,
                        lineHeight: typo.h2.lineHeight,
                      }}
                    >
                      Heading 2
                    </div>
                  )}
                  {typo.h3 && (
                    <div
                      style={{
                        fontSize: typo.h3.fontSize,
                        fontWeight: typo.h3.fontWeight,
                        lineHeight: typo.h3.lineHeight,
                      }}
                      className="text-muted-foreground"
                    >
                      Heading 3
                    </div>
                  )}
                  {typo.body && (
                    <p
                      style={{
                        fontSize: typo.body.fontSize,
                        fontWeight: typo.body.fontWeight,
                        lineHeight: typo.body.lineHeight,
                      }}
                      className="text-muted-foreground"
                    >
                      Body — The quick brown fox jumps over the lazy dog. Design systems help
                      teams build consistent, accessible, and scalable products faster.
                    </p>
                  )}
                  {typo.label && (
                    <p
                      style={{
                        fontSize: typo.label.fontSize,
                        fontWeight: typo.label.fontWeight,
                      }}
                    >
                      Label text
                    </p>
                  )}
                  {typo.caption && (
                    <p
                      style={{
                        fontSize: typo.caption.fontSize,
                        fontWeight: typo.caption.fontWeight,
                      }}
                      className="text-muted-foreground"
                    >
                      Caption — Supporting detail text
                    </p>
                  )}
                </div>
              </PreviewSection>
            )}

            {/* Color palette */}
            {palette.length > 0 && (
              <PreviewSection title="Brand Color Scale">
                <div className="flex gap-1 flex-wrap">
                  {palette.map((shade) => {
                    const isPrimary = shade === primaryShade;
                    return (
                      <div key={shade} className="flex flex-col items-center gap-1" title={`${shade}${isPrimary ? ' · primary' : ''}`}>
                        <div
                          className={cn(
                            'rounded-md border border-black/10 transition-all',
                            isPrimary
                              ? 'w-10 h-10 ring-2 ring-offset-1 ring-primary/60'
                              : 'w-8 h-8',
                          )}
                          style={{ backgroundColor: `var(--color-primary-${shade})` }}
                        />
                        <span className={cn('text-[10px] font-mono', isPrimary ? 'text-primary font-semibold' : 'text-muted-foreground')}>
                          {shade}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </PreviewSection>
            )}
          </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
