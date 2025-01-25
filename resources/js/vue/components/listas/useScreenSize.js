import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useScreenSize(threshold = 1023) {
    const isMobile = ref(window.innerWidth <= threshold);

    const checkScreenSize = () => {
        isMobile.value = window.innerWidth <= threshold;
    };

    onMounted(() => {
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('resize', checkScreenSize);
    });

    return { isMobile };
}