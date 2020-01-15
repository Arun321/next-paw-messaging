<template>
    <div class="container">
            <h3 class=" text-center">Messaging</h3>
        <div class="messaging">

            <div class="inbox_msg">
                <div class="inbox_people">
                    <div class="headind_srch">
                        <div class="row">
                            <div class="col-md-12 form-group contacts_header plus-icon"
                                 style="display: inline-flex;padding-left: 0px !important;">
                                <div class="col-md-2 offset-md-1" style="padding: 0px !important;">
                                    <button type="button" class="start_conversation" ><i class="fa fa-plus" aria-hidden="true"></i></button>
                                </div>
                                <div class="col-md-8" style="text-align: left;">
                                    <select v-on:change="sortBy" v-model="selectedOption" class="form-control filters" name="msg_filter" id="msg_filter" style="width: 220px;">
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
                                <div class="stylish-input-group" >
                                    <input type="text" v-on:keyup="searchData($event)" v-model="search" class="search-bar" placeholder="Search" >
                                    <span class="input-group-addon">
                                    <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
                                            </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="contactLoading" style="display: flex; justify-content: center; align-items: center;">
                        <i class="fa fa-circle-o-notch fa-spin" style="font-size: 45px; color: deepskyblue;"></i>
                    </div>
                    <div id="inbox_chat" class="inbox_chat" v-show="contacts.length > 0">

                        <div v-if="!contactLoading">
                            <div class="chat_list" v-for="contact in contacts"
                                 v-on:click="loadMessage(contact.contact_id, 'yes')"
                                 :class="{'active': contact.contact_id == activeIndex}">
                                <div class="chat_people" >
                                    <div class="chat_img">
                                        <img v-show="!contact.ps_id" src="https://app.nextpaw.com/img/text-msg.png">
                                        <img v-show="contact.ps_id" src="https://app.nextpaw.com//img/fb-msg.png">
                                    </div>
                                    <div class="chat_ib">
                                        <h5>{{contact.first_name}} {{contact.last_name}} <span class="archive" v-if="contact.archived === 1">Archived</span></h5>
                                        <p>{{ trunc(contact.body) }}<span class="chat_date">{{ format_date(contact.message_created_at) }}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="loadMore" class="load">
                            <h4>loading...</h4>
                        </div>
<!--                        <div style="display: flex; justify-content: center">-->
<!--                            <button v-if="" class="btn-success" @click="loadContacts">Load More</button>-->
<!--                        </div>-->

<!--                        <scroll-loader :loader-method="loadContacts" :loader-disable="!loadMore">-->
<!--                        </scroll-loader>-->
                    </div>
                </div>


                <div class="mesgs">
                    <div class="sticky">
                        <div class="col-md-12" >
                            <div class="toolbar__label current_name text-center" >
                                <h4>{{ this.activeTitle }}</h4>
                                <span class="archive-icon" v-on:click="archivedContact" >
<!--                                    <img class="archive-img" src="https://image.flaticon.com/icons/svg/73/73581.svg" alt="">-->
                                    <i class="fa fa-archive" aria-hidden="true"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div v-if="msgLoading" style="display: flex; justify-content: center; align-items: center;">
                        <i class="fa fa-circle-o-notch fa-spin" style="font-size: 45px; color: blue;"></i>
                    </div>
                    <div v-if="!msgLoading">
                        <div id="msg_history" class="msg_history">
                            <div v-for="message in messages"
                                 :class="messageType(message.type, 'incoming_msg', 'outgoing_msg')">
                                <div :class="messageType(message.type, 'received_msg', 'sent_msg')">
                                    <div :class="messageType(message.type, 'received_withd_msg', 'sent_withd_msg')">
                                        <p>{{message.body}}</p>
                                        <span class="time_date"> {{format_time_date( message.message_created_at) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div class="type_msg" >
                            <div class="input_msg_write" >
                                <input type="text"  class="write_msg" placeholder="Type a message" v-model="typedMessage" />
                                <button class="msg_send_btn" type="button" v-on:click="sendMessage">
                                    <i class="fa fa-paper-plane-o"
                                       aria-hidden="true">
                                    </i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import moment from 'moment';
    import axios from 'axios';
    import ScrollLoader from 'vue-scroll-loader';

    Vue.use(ScrollLoader)

    export default {
        data() {
            return {
                loadMore: true,
                msgLoading: false,
                contactLoading: false,
                filter: '',
                activeIndex: 0,
                loadAll: false,
                activeTitle: '',
                page: 1,
                filterPage: 1,
                user: JSON.parse(localStorage.getItem('user')),
                contacts: [],
                typedMessage: '',
                messages: [],
                errors: [],
                search: '',
                selectedOption: '',
                scrollElm: ''

            }
        },
        watch: {
            sortBy: {
                handler(n, o) {
                    this.search = ''
                }
            }
        },
        computed: {

        },
        mounted() {
            this.filteredContacts()
            this.scrollElm = document.querySelector('#inbox_chat')
            this.loadOnScroll()
        },
        methods: {
            loadOnScroll () {
                this.scrollElm.addEventListener('scroll', this.scrollListener)
            },
            scrollListener () {
                if (this.scrollElm.scrollTop + this.scrollElm.clientHeight >= this.scrollElm.scrollHeight) {

                    if (this.loadMore) {
                        this.filteredContacts()
                    } else {
                        this.loadMore = false
                        // $('.loader').hide()
                    }
                    // this.filteredContacts(this.filter, this.search)

                }
            },
            searchData(e) {
                this.filterPage = 1
                this.loadMore = true
                this.search = e.target.value;
                this.filteredContacts()

            },


            sortBy(e) {
                this.filterPage = 1
                this.loadMore = true
                this.filter = e.target.value
                this.filteredContacts()
            },
            scrollToEnd() {
                let container = document.querySelector('.msg_history');
                let height = container.scrollHeight;
                container.scrollTop = height;
            },
            scrollToTop() {
                var myDiv = document.getElementById('inbox_chat');
                if (myDiv) {
                    myDiv.scrollTop = 0;
                }
            },


            archivedContact() {
                axios({
                    url: 'https://1146270492621681-reviews.jenkins.nextpaw.com/graph-api',
                    headers: {
                        Authorization: `Bearer ${this.user.token}`
                    },
                    method: 'POST',
                    data: {
                        query: `{
                            contactArchive(id: ${this.activeIndex}, clientId: 1, locationId: 1){
                                        id
                                        first_name
                                        last_name
                                        archived
                                        error
                                        message
                                        }
                            }`
                    }
                }).then(response => {
                    this.filterPage = 1
                    this.loadMore = true
                    this.filteredContacts()
                }).catch((e) => console.log(e))
                // this.activeIndex=value

            },

            filteredContacts() {
                let filterSearch = '';
                if (this.search === "" || this.search === null) {
                    filterSearch = null
                } else {
                    filterSearch = '"' + this.search + '"'
                }
                    axios({
                        url: 'https://1146270492621681-reviews.jenkins.nextpaw.com/graph-api',
                        headers: {
                            Authorization: `Bearer ${this.user.token}`
                        },
                        method: 'POST',
                        data: {
                            query: `{
                        search(clientId: 1, locationId: 1, contacts: 0,
                                search: ${filterSearch},
                                filter: "${this.filter}",
                                page: ${this.filterPage},
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
                        if (this.filterPage === 1) {
                            this.contacts = []
                        }
                        this.filterPage++
                        let temp1 = response.data.data.search.data;
                        console.log(temp1)

                        if (temp1.length > 0) {
                            this.contacts.push(...temp1)
                            this.loadMore = true
                        } else {
                            this.loadMore = false
                        }
                        // if(this.filterPage === 2 && temp1.length <= 0) {
                        //     this.contacts = []
                        // }
                    }).catch((e) => console.log(e))
                },

            loadMessage: function (value, reload) {
                this.typedMessage = '';
                if (reload == 'yes') {
                    this.msgLoading = true;
                }
                axios({
                    url: 'https://1146270492621681-reviews.jenkins.nextpaw.com/graph-api',
                    headers: {
                        Authorization: `Bearer ${this.user.token}`
                    },
                    method: 'POST',
                    data: {
                        query: `{
                                 singleConversion(id: ${value}, clientId: 1, locationId: 1, page: 1, limit: 20){
                                data {
                                    id
                                    first_name
                                    last_name
                                    contact_id
                                    body
                                    media_url
                                    receiver
                                    sender
                                    contact_created_at
                                    type
                                    status
                                    archived
                                    message_created_at
                                }
                                total
                                per_page
                            }
                        }`
                    }
                }).then(response => {
                    this.msgLoading = false;
                    this.messages = response.data.data.singleConversion.data.reverse()
                    setTimeout(() => {
                        this.scrollToEnd()
                    }, 400)
                    let activeContact = this.contacts.filter(function (elem) {
                        if (elem.contact_id == value) return true;
                    });
                    console.log(activeContact)
                    // if (activeContact[0].ps_id == 'null')
                    let contactNum = !activeContact[0].ps_id ? ' | ' + activeContact[0].sender : ''
                    return this.activeTitle = activeContact[0].first_name + contactNum

                }).catch((e) => console.log(e));
                this.activeIndex = value
            },

            messageType: function (type, class1, class2) {
                if (type === 'received') {
                    return class1;
                } else {
                    return class2;
                }
            },
            sendMessage: function () {
                axios({
                    url: 'https://1146270492621681-reviews.jenkins.nextpaw.com/graph-api',
                    headers: {
                        Authorization: `Bearer ${this.user.token}`
                    },
                    method: 'POST',
                    data: {
                        query: `mutation messageSendMutation
                        {
                            messageSendMutation(clientId: 1, locationId: 1, contactId: ${this.activeIndex}, body: "${this.typedMessage}",
                           )
                            {
                            id
                            error
                            message
                            }
                        }`
                    }
                }).then(response => {
                    this.typedMessage = '';
                    setTimeout(() => {
                        this.loadMessage(response.data.data.messageSendMutation.id, 'no');
                        this.filterPage = 1
                        this.loadMore = true
                        // this.loadAll = true
                        this.filteredContacts()
                        setTimeout(() => {
                            this.scrollToTop()
                        }, 400)
                    }, 500);
                    console.log(response)
                })
                    .catch(e => {
                        this.errors.push(e)
                        // this.activeIndex = value
                    })
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
        width: 40%;
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
        max-height: 531px;
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

    .messaging {
        padding: 0 0 50px 0;
    }

    .msg_history {
        height: 516px;
        overflow-y: scroll;
    }

    .chat_date { font-size:13px; float:right; font-weight: bold;color: #4c4c4c;}

    .archive{font-size:13px; float:right; font-weight: bold;color: #4c4c4c;}

    .active {
        background-color: aliceblue ;
    }
</style>

