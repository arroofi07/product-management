<script lang="ts">
	import { TrendingUp, TrendingDown, Minus } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import * as Card from '$lib/components/ui/card';

	type Props = {
		title: string;
		value: string;
		subtitle?: string;
		icon: any;
		gradient: 'blue' | 'teal' | 'amber' | 'rose' | 'purple' | 'emerald';
		trend?: number; // percentage, positive = up, negative = down
		trendLabel?: string;
	};

	let { title, value, subtitle, icon: Icon, gradient, trend, trendLabel }: Props = $props();

	// We use the gradient prop to determine the accent color of the icon and small highlights
	const accentMap = {
		blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20',
		teal: 'text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-500/20',
		amber: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20',
		rose: 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/20',
		purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20',
		emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20'
	};
</script>

<Card.Root class="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
	<Card.Content class="p-5">
		<div class="flex items-start justify-between">
			<div class="flex-1">
				<p class="text-sm font-medium text-muted-foreground">{title}</p>
				<p class="count-animate mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
				
				{#if subtitle}
					<p class="mt-1 text-xs text-muted-foreground">{subtitle}</p>
				{/if}
				
				{#if trend !== undefined}
					<div class="mt-3 flex items-center gap-1.5">
						{#if trend > 0}
							<div class="flex items-center gap-1 rounded font-medium bg-emerald-100/50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 text-xs">
								<TrendingUp class="size-3" />
								<span>+{trend}%</span>
							</div>
						{:else if trend < 0}
							<div class="flex items-center gap-1 rounded font-medium bg-rose-100/50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 text-xs">
								<TrendingDown class="size-3" />
								<span>{trend}%</span>
							</div>
						{:else}
							<div class="flex items-center gap-1 rounded font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 text-xs">
								<Minus class="size-3" />
								<span>Stabil</span>
							</div>
						{/if}
						
						{#if trendLabel}
							<span class="text-xs text-muted-foreground">{trendLabel}</span>
						{/if}
					</div>
				{/if}
			</div>
			
			<div class={cn("ml-4 flex size-12 flex-shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110", accentMap[gradient])}>
				<Icon class="size-6" />
			</div>
		</div>
	</Card.Content>
</Card.Root>
