<template>
    <div class="inbox_people">
        <div class="headind_srch">
            <div class="row">
                <div class="col-md-12 form-group contacts_header plus-icon"
                     style="display: inline-flex;padding-left: 0px !important;">
                    <div class="offset-md-3" style="text-align: left;">
                        <select v-on:change="sortBy" v-model="selectedOption" class="form-control filters"
                                name="msg_filter" id="msg_filter" style="width: 220px;">
                            <option value="all" >All</option>
                            <option value="unread">Unread</option>
                            <option value="facebook">Facebook</option>
                            <option value="text">Text</option>
                            <option value="website">Website</option>
                            <option value="archive">Archived</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-12 srch_bar">
                    <div class="stylish-input-group offset-md-3">
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
        <div v-bind:id="'inbox_chat' +id " class="inbox_chat" v-show="listContacts.length > 0">
            <div v-if="!listContactLoading">
                <div class="chat_list" v-for="(contact,index) in listContacts"
                     v-on:click="callLoadFunction(listContacts, contact.contact_id)"
                     :class="{'active': contact.contact_id === listActiveIndex || (listActiveIndex === 0 && index === 0)}">
                    <div class="chat_people">
                        <div class="chat_img">
                            <img v-show="!contact.ps_id" src="https://app.nextpaw.com/img/text-msg.png">
                            <img v-show="contact.ps_id" src="https://app.nextpaw.com//img/fb-msg.png">
                        </div>
                        <div class="chat_ib">
                            <h5>{{contact.first_name}} {{contact.last_name}} <span class="archive"
                                                                                   v-if="contact.archived === 1">Archived</span>
                            </h5>
                            <span style="color: black" class="msg-body" v-if='contact.status == "WAITING" || contact.status == "FAILED" '>
                                Message is not delivered
                                <i class="fa fa-times" aria-hidden="true"></i>
                            </span>
                            <p style="color: black" class="msg-body" v-if='contact.status == "SENT"' >
                                {{ trunc(contact.body) }}
                                <i class="fa fa-check-circle" aria-hidden="true" style="float: left"></i>
                                <span class="chat_date">{{ format_date(contact.message_created_at) }}</span>
                                <span class="image" v-if="contact.media_url!=null">
                                    <i class="fa fa-picture-o" aria-hidden="true"></i>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="listLoadMore" class="load">
                <i class="fa fa-spinner fa-spin" style="font-size: 18px"></i>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import {mapState} from 'vuex'
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
        computed: {
            ...mapState('listStore', ['triggerFilteredContacts'])
        },
        data() {
            return {
                listLoadMore: false,
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
                loadContact:'',
                isLoading: false
            }
        },

        mounted() {
            this.filteredContacts()
            // this.contactList()
            this.scrollElm = document.querySelector('#inbox_chat' + this.id)
            this.loadOnScroll()
        },
        watch: {
            triggerFilteredContacts: {
                handler (n, o) {
                    this.listFilterPage = 1
                    this.filteredContacts()
                    setTimeout(() => {
                        this.scrollToTop()
                    }, 400)
                }
            }
        },
        methods:{
            callLoadFunction(listContacts, contact_id){
                this.loadMessage(listContacts, contact_id, 'yes')
                    .then(response => {
                        this.listActiveIndex = response
                    })
            },

            scrollToTop() {
                // console.log('scrollToTop');
                var myDiv = document.getElementById('inbox_chat1');
                if (myDiv) {
                    myDiv.scrollTop = 0;
                }
            },

            loadOnScroll() {
                // console.log('loadOnScroll');
                this.scrollElm.addEventListener('scroll', this.scrollListener)
            },

            scrollListener() {
                // console.log('scrollListener');
                if (this.scrollElm.scrollTop + this.scrollElm.clientHeight >= this.scrollElm.scrollHeight) {
                    // console.log(this.listLoadMore)
                    if (this.listLoadMore) {
                        this.filteredContacts()
                    } else {
                        this.listLoadMore = false
                    }
                }
            },

            searchData(e) {
                // console.log('searchDate');
                this.listFilterPage = 1
                this.listLoadMore = true
                this.listSearch = e.target.value;
                this.filteredContacts()
            },

            sortBy(e) {
                // console.log('sortBy');
                this.listFilterPage = 1
                this.listLoadMore = true
                this.listFilter = e.target.value
                this.loadMessage(this.listContacts, 0,'no')
                this.filteredContacts()
            },

            filteredContacts() {
                // console.log('filteredContacts');
                if(this.isLoading) {
                    return false;
                }
                this.isLoading = true;
                let filterSearch = '';
                if (this.listSearch === "" || this.listSearch === null) {
                    filterSearch = null
                } else {
                    filterSearch = '"' + this.listSearch + '"';
                    filterSearch = filterSearch.replace(/\s/g, '')
                }
                axios({
                    url: 'https://app.nextpaw.com/graph-api',
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
                    let temp1 = response.data.data.search.data;
                    if (temp1.length > 0) {
                        // console.log(this.listContacts.length)
                        this.listContacts.push(...temp1)
                        if (this.listFilterPage === 1) {
                            this.loadMessage(this.listContacts,response.data.data.search.data[0].contact_id,'no')
                        }
                        if (temp1.length < 15) {
                               this.listLoadMore = false
                        }
                        this.listLoadMore = true
                    }
                    else {
                        this.listActiveIndex = 0;
                        this.listLoadMore = false
                    }
                    this.listFilterPage++
                    this.isLoading = false
                }).catch((e) => {
                    this.isLoading = false
                    console.log(e)
                })
            },

            format_date(value) {
                if (value) {
                    return moment(String(value)).format('MM/DD/YYYY')
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
    .load{
        text-align: center;
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
    .fa-check-circle{
        position: relative;
        top: 4px;
        right: 5px;
    }
    .msg-body{
        font-size: 14px;
        margin: auto;
        padding-left: 9px;
    }
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
        /*text-align: right;*/
        width: 220px;
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
        width: 220px;
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
        /*border-radius: 3px;*/
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
        background-color: #39A7DE;
    }
    div#myModal .filters {
        display: none;
    }


</style>
