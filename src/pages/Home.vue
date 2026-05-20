<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col items-center">
    <section class="text-center py-16 sm:py-20">
      <h1 class="text-4xl sm:text-5xl font-bold text-text mb-4 tracking-tight">
        挑战西交<span class="text-primary">图寻</span>
      </h1>
      <p class="text-lg text-text-light max-w-lg mx-auto leading-relaxed">
        发现校园隐藏机位，用镜头记录西交的每一个角落。<br />
        猜图答题，赢取纪念奖品，分享属于你的校园故事。
      </p>
      <div class="flex items-center justify-center gap-3 mt-8">
        <router-link to="/photos" class="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-light transition-colors shadow-sm">
          开始探索
        </router-link>
        <router-link to="/register" class="px-6 py-3 rounded-xl border border-border text-text font-medium hover:bg-bg transition-colors">
          加入我们
        </router-link>
      </div>
    </section>

    <section class="grid sm:grid-cols-3 gap-6 w-full max-w-4xl mb-16">
      <router-link
        v-for="item in [
          { icon: '📸', title: '投稿机位', desc: '分享你发现的校园隐蔽机位，让更多人看见西交之美。', to: '/upload' },
          { icon: '🔎', title: '猜图挑战', desc: '根据照片线索找到对应地点，拍摄同一角度照片来验证。', to: '/photos' },
          { icon: '🎁', title: '赢取奖品', desc: '首个答对者获得纪念奖品，用实力证明你对校园的熟悉。', to: '/prizes' },
        ]"
        :key="item.title"
        :to="item.to"
        class="bg-card rounded-xl p-6 border border-border text-center hover:shadow-md hover:border-primary/30 transition-all cursor-pointer block"
      >
        <div class="text-4xl mb-3">{{ item.icon }}</div>
        <h3 class="font-semibold text-text mb-2">{{ item.title }}</h3>
        <p class="text-sm text-text-light leading-relaxed">{{ item.desc }}</p>
      </router-link>
    </section>

    <section class="text-center py-12">
      <p class="text-text-light text-sm">每一张照片背后，都有一个等待被发现的故事 🌿</p>
    </section>
  </div>
</template>
