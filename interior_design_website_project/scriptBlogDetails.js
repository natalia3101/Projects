Vue.component('article-components', {
    data() {
        return {
            findElement: '',
            contentArticles: [{
                    title: "Let’s Get Solution for Building Construction Work",
                    img: "article1.svg",
                    tag: "Kitchen",
                    itemData: "26 December,2022"
                },
                {
                    title: "Low Cost Latest Invented Interior Designing Ideas.",
                    img: "article2.svg",
                    tag: "Bedroom",
                    itemData: "25 December,2022"

                },
                {
                    title: "Design sprints are great",
                    img: "article1.svg",
                    tag: "Architecture",
                    itemData: "24 December,2022"

                },
                {
                    title: "Best For Any Office & Business Interior Solution",
                    img: "article2.svg",
                    tag: "Bedroom",
                    itemData: "23 December,2022"

                }, {
                    title: "Low Cost Latest Invented Interior Designing Ideas",
                    img: "article1.svg",
                    tag: "Kitchen Planning",
                    itemData: "22 December,2022"

                },
            ],
            tagList: [
                "Kitchen",
                "Building",
                "Architecture",
                "Bedroom",
                "Kitchen Planning",

            ]

        }
    },

    template: `
    <div class="blogDetails_container">
        <div class="blog_details">
            <div class="blog_details_article" v-for="(article, index) in filterArticle" :key="index">
                <h2 class="article__title">{{article.title}}</h2>
                <img class="article__img" :src="'../project/images/blogDetailsPage/' + article.img" :alt="article.img">
                <div class="article__info">
                    <p class="article__info-date">{{article.itemData}}</p>
                    <p class="article__info-links">Interior / Home / Decore</p>
                </div>
                <p class="article__text">Lorem ipsum dolor sit amet, adipiscing Aliquam eu sem vitae turpmaximus.posuere in.Contrary to popular belief.There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by
                    injecthumour, or randomised words which don't look even slightly believable.
                    <br>
                    <br>Embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.
                </p>
                <div v-if="index === 0" class="quotation_block">
                    <p class="quotation_block-symbol"><img src="images/blogDetailsPage/quot.svg" alt="quot mark"></p>
                    <p class="quotation_block-text">The details are not the details. They make the design.</p>
                </div>
            </div>
        </div>
        
        <div class="tags">
            <div class="tags__buttons-container">
                <h2 class="tags__title">Tags</h2>
                <div class="tags__buttons">
                    <button @click="filterClick('All')" class="tags__buttons-item">All</button>
                    <button v-for="btn in tagList" @click="filterClick(btn)" class="tags__buttons-item">{{ btn }}</button>
                </div>
            </div>
        </div>
    </div>
    `,

    methods: {
        filterClick(item) {
            this.findElement = item;
        },
    },
    computed: {
        filterArticle() {
            return this.findElement !== 'All' ? this.contentArticles.filter((el) => el.tag.includes(this.findElement)) : this.contentArticles;
        }
    }
})


new Vue({
    el: '.blogDetails_page_box',
});