<template>
    <div class="inbox_people">
        <div class="headind_srch">
            <div class="row">
                <div class="col-md-12 form-group contacts_header plus-icon"
                     style="display: inline-flex;padding-left: 0px !important;">
                    <div class="offset-md-3" style="text-align: left;">
                        <select v-on:change="sortBy" v-model="selectedOption" class="form-control filters"
                                name="msg_filter" id="msg_filter" style="width: 220px;">
                            <option value="all">All</option>
                            <option value="unread">Unread</option>
                            <option value="facebook">Facebook</option>
                            <option value="text">Text</option>
                            <option value="website">Website</option>
                            <option value="archive">Archived</option>
                        </select>
                    </div>
                </div>

                <div class="offset-md-2 srch_bar">
                    <div class="stylish-input-group">
                        <input type="text" v-on:keyup="searchData($event)" v-model="listSearch"
                               class="search-bar" placeholder="Search">
                        <span class="input-group-addon">
                                    <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
                                            </span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="listContactLoading" style="display: flex; justify-content: center; align-items: center;">
            <i class="fa fa-circle-o-notch fa-spin" style="font-size: 45px; color: deepskyblue;"></i>
        </div>
        <div v-bind:id="'inbox_chat' + id" class="inbox_chat" v-show="listContacts.length > 0">
            <div v-if="!listContactLoading">
                <div class="chat_list" v-for="contact in listContacts"
                     v-on:click="listActiveIndex = loadMessage(listContacts, contact.contact_id, 'yes')"
                     :class="{'active': contact.contact_id == listActiveIndex}">
                    <div class="chat_people">
                        <div class="chat_img">
                            <img v-show="!contact.ps_id" src="https://app.nextpaw.com/img/text-msg.png">
                            <img v-show="contact.ps_id" src="https://app.nextpaw.com//img/fb-msg.png">
                        </div>
                        <div class="chat_ib">
                            <h5>{{contact.first_name}} {{contact.last_name}} <span class="archive"
                                                                                   v-if="contact.archived === 1">Archived</span>
                            </h5>
                            <p>{{ trunc(contact.body) }}<span class="chat_date">{{ format_date(contact.message_created_at) }}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="listLoadMore" class="load">
                <h4>loading...</h4>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    export default {
        name: "ListContact",
        props: {
            loadMessage: {
                type: Function
            },
            id: {
                type: String
            },
            contactType: {
                type: String
            },
            zeroOrOne: {
                type: Number
            }
        },
        data() {
            return {
                listLoadMore: true,
                listContactLoading: false,
                listFilter: '',
                listActiveIndex: 0,
                // activeTitle: '',
                page: 1,
                listFilterPage: 1,
                listUser: JSON.parse(localStorage.getItem('user')),
                listContacts: [],
                // typedMessage: '',
                // messages: [],
                // errors: [],
                listSearch: '',
                selectedOption: '',
                scrollElm: '',
                btnUpload: '',
                msg: '',
            }
        },
        mounted() {
            this.filteredContacts()
            this.scrollElm = document.querySelector('#inbox_chat' + this.id)
            this.loadOnScroll()
        },
        methods:{
            loadOnScroll() {
                this.scrollElm.addEventListener('scroll', this.scrollListener)
            },
            scrollListener() {
                if (this.scrollElm.scrollTop + this.scrollElm.clientHeight >= this.scrollElm.scrollHeight) {
                    if (this.listLoadMore) {
                        this.filteredContacts()
                    } else {
                        this.listLoadMore = false
                    }
                }
            },
            searchData(e) {
                this.listFilterPage = 1
                this.listLoadMore = true
                this.listSearch = e.target.value;
                this.filteredContacts()

            },
            sortBy(e) {
                this.listFilterPage = 1
                this.listLoadMore = true
                this.listFilter = e.target.value
                this.filteredContacts()
            },
            filteredContacts() {
                let filterSearch = '';
                if (this.listSearch === "" || this.listSearch === null) {
                    filterSearch = null
                } else {
                    filterSearch = '"' + this.listSearch + '"'
                }


                axios({
                    url: 'https://1146270492621681-reviews.jenkins.nextpaw.com/graph-api',
                    headers: {
                        Authorization: `Bearer ${this.listUser.token}`
                    },
                    method: 'POST',
                    data: {
                        query: `{
                        search(clientId: 1, locationId: 1, contacts: ${this.zeroOrOne},
                                search: ${filterSearch},
                                filter: "${this.listFilter}",
                                page: ${this.listFilterPage},
                                limit: 15){
                                            data{
                                                id
                                                contact_id
                                                archived
                                                first_name
                                                last_name
                                                body
                                                media_url
                                                message_created_at
                                                deleted_at
                                                type
                                                status
                                                sender
                                                receiver
                                                ps_id
                                                unread_message_count
                                            }
                                            total
                                            per_page
                                }
                        }`
                    }
                }).then(response => {

                    if (this.listFilterPage === 1) {
                        this.listContacts = []
                    }
                    this.listFilterPage++
                    let temp1 = response.data.data.search.data;
                    console.log(temp1)

                    if (temp1.length > 0) {
                        this.listContacts.push(...temp1)
                        this.listLoadMore = true
                    } else {
                        this.listLoadMore = false
                    }
                    // if(this.filterPage === 2 && temp1.length <= 0) {
                    //     this.contacts = []
                    // }
                }).catch((e) => console.log(e))
            },


            format_date(value) {
                if (value) {
                    return moment(String(value)).format('MM/DD/YYYY')
                }
            },
            format_time_date(value) {
                if (value) {
                    return moment(String(value)).format('MM/DD/YYYY | h:mm a')
                }
            },
            trunc(n) {
                return (n && n.length > 15) ? n.substr(0, 10) + '...' : n
            }
        }
    }
</script>

<style scoped>
    .sticky {
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        padding: 5px;
        /*background-color: #cae8ca;*/
        /*border: 2px solid #c4c4c4;*/
    }

    /*.archive-icon {*/
    /*    position: absolute;*/
    /*    right: 0;*/
    /*    font-size: 25px;*/
    /*    margin-top: -10px;*/
    /*}*/

    /*.archive-img {*/
    /*    position: absolute;*/
    /*    width: 24px;*/
    /*    right: 0;*/
    /*    top: 5px;*/
    /*}*/

    .fa-archive {
        position: absolute;
        width: 24px;
        font-size: 18px;
        right: 0;
        top: 5px;
    }

    .container {
        max-width: 1170px;
        margin: auto;
    }

    img {
        max-width: 100%;
    }

    .inbox_people {
        background: #f8f8f8 none repeat scroll 0 0;
        float: left;
        overflow: hidden;
        width: 100%;
        border-right: 1px solid #c4c4c4;
    }

    .inbox_msg {
        border: 1px solid #c4c4c4;
        clear: both;
        overflow: hidden;
    }

    .top_spac {
        margin: 20px 0 0;
    }


    .recent_heading {
        float: left;
        width: 40%;
    }

    .srch_bar {
        display: inline-block;
        text-align: right;
        width: 60%;
        padding: 0;
        outline: 0;
    }

    .headind_srch {
        padding: 10px 29px 10px 20px;
        overflow: hidden;
        border-bottom: 1px solid #c4c4c4;
    }

    .recent_heading h4 {
        color: #05728f;
        font-size: 21px;
        margin: auto;
    }

    .srch_bar input {
        border: 1px solid #cdcdcd;
        border-width: 0 0 1px 0;
        width: 80%;
        padding: 2px 0 4px 6px;
        background: none;
        outline: 0;
    }

    .srch_bar .input-group-addon button {
        background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
        border: medium none;
        padding: 0;
        color: #707070;
        font-size: 18px;
        outline: 0;
    }

    .srch_bar .input-group-addon {
        margin: 0 0 0 -27px;
    }

    .chat_ib h5 {
        font-size: 15px;
        color: #464646;
        margin: 0 0 8px 0;
    }

    .chat_ib h5 span {
        font-size: 13px;
        float: right;
    }

    .chat_ib p {
        font-size: 14px;
        color: #989898;
        margin: auto
    }

    .chat_img {
        float: left;
        width: 11%;
    }

    .chat_ib {
        float: left;
        padding: 0 0 0 15px;
        width: 88%;
    }

    .chat_people {
        overflow: hidden;
        color: white;
        clear: both;
        overflow: scroll;
    }

    .chat_list {
        border-bottom: 1px solid #c4c4c4;
        margin: 0;
        padding: 18px 16px 10px;
        overflow-y: scroll;
    }

    .inbox_chat {
        scroll-behavior: smooth;
        max-height: 520px;
        overflow-y: scroll;
    }

    .active_chat {
        background: #ebebeb;
    }

    .incoming_msg_img {
        display: inline-block;
        width: 6%;
    }

    .received_msg {
        display: inline-block;
        padding: 0 0 0 10px;
        vertical-align: top;
        width: 92%;
    }

    .received_withd_msg p {
        background: #ebebeb none repeat scroll 0 0;
        border-radius: 3px;
        color: #646464;
        font-size: 14px;
        margin: 0;
        padding: 5px 10px 5px 12px;
        width: 100%;
    }

    .time_date {
        color: #747474;
        display: block;
        font-size: 12px;
        margin: 8px 0 0;
    }

    .received_withd_msg {
        width: 57%;
    }

    .mesgs {
        border-left: 1px solid #c4c4c4;
        float: left;
        padding: 30px 15px 0 25px;
        width: 60%;
    }

    .sent_msg p {
        background: #05728f none repeat scroll 0 0;
        border-radius: 3px;
        font-size: 14px;
        margin: 0;
        color: #fff;
        padding: 5px 10px 5px 12px;
        width: 100%;
    }

    .outgoing_msg {
        overflow: hidden;
        margin: 26px 0 26px;
    }

    .sent_msg {
        float: right;
        width: 46%;
    }

    .input_msg_write input {
        background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
        border: medium none;
        color: #4c4c4c;
        font-size: 15px;
        min-height: 48px;
        width: 100%;
        outline: 0;
    }

    .type_msg {
        border-top: 1px solid #c4c4c4;
        position: relative;
    }

    .msg_send_btn {
        background: #05728f none repeat scroll 0 0;
        border: medium none;
        border-radius: 50%;
        color: #fff;
        cursor: pointer;
        font-size: 17px;
        height: 33px;
        position: absolute;
        right: 0;
        top: 11px;
        width: 33px;
    }

    .img_send_btn {
        background: #05728f none repeat scroll 0 0;
        border: medium none;
        border-radius: 50%;
        color: #fff;
        cursor: pointer;
        font-size: 17px;
        height: 33px;
        position: absolute;
        right: 40px;
        top: 11px;
        width: 33px;
    }

    .messaging {
        padding: 0 0 50px 0;
    }

    .msg_history {
        height: 516px;
        overflow-y: scroll;
    }

    .chat_date {
        font-size: 13px;
        float: right;
        font-weight: bold;
        color: #4c4c4c;
    }

    .archive {
        font-size: 13px;
        float: right;
        font-weight: bold;
        color: #4c4c4c;
    }

    .active {
        background-color: aliceblue;
    }
    div#myModal .filters {
        display: none;
    }


</style>
