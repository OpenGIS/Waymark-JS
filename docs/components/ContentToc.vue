<script setup>
const { toc, page } = useContent();

const title = computed(() => {
	if (page.title) {
		return page.title;
	}

	return "Contents";
});
</script>

<template>
	<nav class="toc">
		<h4 v-if="title">{{ title }}</h4>

		<ul v-if="toc && toc.links">
			<li v-for="link in toc.links" :key="link.text">
				<a :href="`#${link.id}`">
					{{ link.text }}
				</a>

				<ul v-if="link.children">
					<li v-for="child in link.children" :key="child.text">
						<a :href="`#${child.id}`">
							{{ child.text }}
						</a>
					</li>
				</ul>

				<!-- <li v-for="link in toc.links" :key="link.text">
				<a :href="`#${link.id}`">
					{{ link.text }}
				</a>
			</li> -->
			</li>
		</ul>
	</nav>
</template>

<style lang="less">
.toc {
	color: #666 !important;
	padding: 10px;
	padding-left: 10px;
	margin-bottom: 20px;
	background-color: #f7f7f7;
	border-left: 4px solid #e0e0e0;

	h4 {
		margin: 10px 0;
		font-weight: 600;
		color: #999;
	}

	ul {
		margin-left: 10px;
		padding-left: 0;
		list-style: none;

		li {
			display: block;
			padding: 5px;

			a {
				text-decoration: none;

				&:hover {
					background-color: #f0f0f0;
				}
			}

			ul {
				li {
				}
			}
		}
	}
}
</style>
