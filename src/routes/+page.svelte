<script>
    let { data } = $props();
</script>

<main>
    <div class="container">
        <h1>🏰 Welcome to Burgen API</h1>
        <p>Explore the most beautiful castles in the region. Click on a castle to see more details!</p>

        <div class="api-link">
            <a href="/api/burgen" target="_blank">View Burgen API</a>
        </div>

        <ul>
            {#each data.castles as castle}
                <li>
                    <a href="/api/burgen/{castle.id}">{castle.name}</a>
                </li>
            {/each}
        </ul>
    </div>
</main>

<style>
    main {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f7f7f7;
        padding: 20px;
    }

    .container {
        max-width: 600px;
        width: 100%;
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        text-align: center;
    }

    h1 {
        font-size: 2.5rem;
        color: #333;
        margin-bottom: 10px;
    }

    p {
        font-size: 1.2rem;
        color: #666;
        margin-bottom: 20px;
    }

    .api-link {
        margin-bottom: 20px;
    }

    .api-link a {
        display: inline-block;
        background: #007bff;
        color: white;
        padding: 12px 24px;
        font-size: 1rem;
        border-radius: 8px;
        text-decoration: none;
        transition: 0.3s;
    }

    .api-link a:hover {
        background: #0056b3;
    }

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        background: #f1f1f1;
        margin-bottom: 10px;
        padding: 15px;
        border-radius: 8px;
        transition: 0.3s;
    }

    li:hover {
        background: #e0e0e0;
    }

    li a {
        text-decoration: none;
        font-size: 1.2rem;
        font-weight: bold;
        color: #007bff;
        transition: 0.3s;
    }

    li a:hover {
        text-decoration: underline;
    }
</style>
