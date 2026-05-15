<script setup lang="ts">
import type { PhotoListItem } from '../types'

defineProps<{ photo: PhotoListItem }>()
</script>

<template>
  <router-link
    :to="`/photos/${photo.id}`"
    class="group block bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border hover:border-primary/20"
  >
    <div class="aspect-[4/3] overflow-hidden bg-gray-100 relative">
      <img
        :src="photo.image_url"
        :alt="photo.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div v-if="photo.solved" class="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
        已破解
      </div>
    </div>
    <div class="p-4">
      <h3 class="font-semibold text-text truncate group-hover:text-primary transition-colors">
        {{ photo.title }}
      </h3>
      <p v-if="photo.description" class="text-sm text-text-light mt-1 line-clamp-2">
        {{ photo.description }}
      </p>
      <div class="flex items-center justify-between mt-3 text-xs text-text-light">
        <span>{{ photo.author.name }}</span>
        <span>{{ photo.attempts_count }} 次尝试</span>
      </div>
    </div>
  </router-link>
</template>
