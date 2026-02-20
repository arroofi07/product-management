<script lang="ts">
	import { TrendingUp, TrendingDown, Minus } from 'lucide-svelte';
	import { cn } from '$lib/utils';

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

	const gradientMap = {
		blue: 'gradient-blue',
		teal: 'gradient-teal',
		amber: 'gradient-amber',
		rose: 'gradient-rose',
		purple: 'gradient-purple',
		emerald: 'gradient-emerald'
	};
</script>

<div
	class={cn('relative overflow-hidden rounded-2xl p-5 text-white shadow-lg', gradientMap[gradient])}
>
	<!-- Background decoration -->
	<div class="absolute -top-4 -right-4 size-24 rounded-full bg-white/10"></div>
	<div class="absolute -top-2 -right-2 size-16 rounded-full bg-white/10"></div>

	<div class="relative flex items-start justify-between">
		<div class="flex-1">
			<p class="text-xs font-medium tracking-wider text-white/70 uppercase">{title}</p>
			<p class="count-animate mt-1 text-2xl font-bold">{value}</p>
			{#if subtitle}
				<p class="mt-0.5 text-xs text-white/60">{subtitle}</p>
			{/if}
			{#if trend !== undefined}
				<div class="mt-2 flex items-center gap-1">
					{#if trend > 0}
						<TrendingUp class="size-3.5 text-white/80" />
						<span class="text-xs text-white/80">+{trend}%</span>
					{:else if trend < 0}
						<TrendingDown class="size-3.5 text-white/80" />
						<span class="text-xs text-white/80">{trend}%</span>
					{:else}
						<Minus class="size-3.5 text-white/80" />
						<span class="text-xs text-white/80">Stabil</span>
					{/if}
					{#if trendLabel}
						<span class="text-xs text-white/60">{trendLabel}</span>
					{/if}
				</div>
			{/if}
		</div>
		<div class="ml-3 flex size-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/20">
			<Icon class="size-6 text-white" />
		</div>
	</div>
</div>
