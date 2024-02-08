<template>
  <main>
    <ClientOnly>
      <Map />
    </ClientOnly>

    <ContentDoc class="markdown-body">
      <template #not-found>
        <Map mapPath="examples/viewer/404.html" />

        <h1>Not Found</h1>

        <p>The content you are looking for can not be found.</p>
      </template>
    </ContentDoc>

    <ContentNav />
  </main>
</template>
