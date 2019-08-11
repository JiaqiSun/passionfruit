<template>
  <div id="app" class="ide-root">
    <nav class="ide-nav">
      <router-link to="/">
        <b-icon icon="apple" size="is-large"></b-icon>
      </router-link>
      <router-link to="/about">
        <b-icon icon="access-point-network" size="is-large"></b-icon>
      </router-link>
    </nav>

    <router-view class="ide-main" />
  </div>
</template>

<style lang="stylus">
.ide-root
  display: flex
  height: 100vh

  nav.ide-nav
    background: #00000040

    a
      display: block
      text-align: center
      margin: 2rem 1rem
      color: #343c3d

    a.router-link-exact-active
      color: #1abc9c

  .ide-main
    flex: 1
    overflow-y: auto
    padding: 20px

</style>
