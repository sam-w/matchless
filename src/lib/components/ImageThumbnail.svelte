<script lang="ts">
    export let url: string;
</script>

<div>
    <a href={url} target="_blank">
        <!-- svelte-ignore a11y-missing-attribute -->
        <img
            src={url}
            class="size-[200px] rounded-md border object-cover hover:outline hover:outline-2"
        />
    </a>
</div>
