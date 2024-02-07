<template>
  <main>
    <ClientOnly>
      <Demo />
    </ClientOnly>

    <ContentDoc class="markdown-body">
      <template #not-found>
        <h1>Not Found</h1>

        <p>The content you are looking for can not be found.</p>
      </template>
    </ContentDoc>
  </main>
</template>

<style>
main {
  margin-top: 80px;
}
</style>
