<!--<template>-->
<!--&lt;!&ndash;            ALL CONTACTS&ndash;&gt;-->
<!--    <div class="modal fade" id="myModal" role="dialog">-->
<!--        <div class="modal-dialog">-->
<!--            &lt;!&ndash;          modal content  &ndash;&gt;-->
<!--            <div class="modal-content">-->
<!--                <div class="modal-header">-->
<!--                    <div>-->
<!--                        <button type="button" class="btn btn-info btn-sm" data-toggle="modal" data-target="#addNewContact" style="margin-left: 150px">-->
<!--                            NEW CONTACT-->
<!--                        </button>-->
<!--                    </div>-->
<!--                    <div>-->
<!--                        <button type="button" class="close" data-dismiss="modal">&times;</button>-->
<!--                    </div>-->

<!--                </div>-->
<!--                <div class="stylish-input-group offset-md-3">-->
<!--                    <input type="text" class="search-bar" placeholder="Search" v-on:keyup="searchData1($event)" v-model="contactSearch">-->
<!--                    <span class="input-group-addon">-->
<!--                            <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>-->
<!--                        </span>-->
<!--                </div>-->
<!--&lt;!&ndash;                CONTACT LIST&ndash;&gt;-->
<!--                <div class="inbox_chat">-->
<!--                    <div class="chat_list active_chat" v-for="contact in Contacts">-->

<!--                        <div class="chat_people">-->
<!--                            <div class="chat_img">-->
<!--                                <img v-show="!contact.ps_id" src="https://app.nextpaw.com/img/text-msg.png">-->
<!--                                <img v-show="contact.ps_id" src="https://app.nextpaw.com//img/fb-msg.png" alt="">-->
<!--                            </div>-->
<!--                            <div class="chat_ib">-->
<!--                                <h5>{{ contact.first_name }} {{ contact.last_name }}</h5>-->
<!--                                <p> {{ trunc(contact.body) }}</p>-->
<!--                                <span class="chat_date">{{ format_date(contact.message_created_at) }}</span>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div v-if="contactloadMore" class="load">-->
<!--                    <i class="fa fa-spinner fa-spin" style="font-size: 18px"></i>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
<!--    </div>-->
<!--</template>-->

<!--<script>-->
<!--    import ListContact from "./ListContact";-->
<!--    export default {-->
<!--        name: "AddContact",-->
<!--        components: {ListContact},-->
<!--        data(){-->
<!--            return{-->
<!--                allUser:JSON.parse(localStorage.getItem('user')),-->
<!--                contactfilterPage:1,-->
<!--                Contacts:[],-->
<!--                contactloadMore:false,-->
<!--                allActiveIndex:0,-->
<!--                contactSearch:''-->
<!--            }-->
<!--        },-->
<!--        mounted() {-->
<!--            this.allfilteredContacts()-->
<!--        },-->
<!--        methods:{-->
<!--            allfilteredContacts() {-->
<!--                let filterSearch1 = '';-->
<!--                if (this.contactSearch === "" || this.contactSearch === null) {-->
<!--                    filterSearch1 = null-->
<!--                } else {-->
<!--                    filterSearch1 = '"' + this.contactSearch + '"';-->
<!--                    filterSearch1 = filterSearch1.replace(/\s/g, '')-->
<!--                }-->
<!--                axios({-->
<!--                    url: 'https://app.nextpaw.com/graph-api',-->
<!--                    headers: {-->
<!--                        Authorization: `Bearer ${this.allUser.token}`-->
<!--                    },-->
<!--                    method: 'POST',-->
<!--                    data: {-->
<!--                        query: `{-->
<!--                        search(clientId: 1, locationId: 1, contacts: 1,-->
<!--                                search: ${filterSearch1},-->
<!--                                filter: "all",-->
<!--                                page: ${this.contactfilterPage},-->
<!--                                limit: 100){-->
<!--                                            data{-->
<!--                                                id-->
<!--                                                contact_id-->
<!--                                                archived-->
<!--                                                first_name-->
<!--                                                last_name-->
<!--                                                body-->
<!--                                                media_url-->
<!--                                                message_created_at-->
<!--                                                deleted_at-->
<!--                                                type-->
<!--                                                status-->
<!--                                                sender-->
<!--                                                receiver-->
<!--                                                ps_id-->
<!--                                                unread_message_count-->
<!--                                            }-->
<!--                                            total-->
<!--                                            per_page-->
<!--                                }-->
<!--                        }`-->
<!--                    }-->
<!--                }).then(response => {-->
<!--                    if (this.contactfilterPage === 1) {-->
<!--                        this.Contacts = []-->
<!--                    }-->
<!--                    console.log(this.contactfilterPage)-->
<!--                    let temp1 = response.data.data.search.data;-->
<!--                    if (temp1.length > 0) {-->
<!--                        this.Contacts.push(...temp1)-->
<!--                        this.contactloadMore = true-->
<!--                    }-->
<!--                    else {-->
<!--                        this.contactloadMore = false-->
<!--                    }-->
<!--                    this.contactfilterPage++-->
<!--                    this.contactloadMore = false-->
<!--                }).catch((e) => {-->
<!--                    console.log(e)-->
<!--                })-->
<!--            },-->
<!--            format_date(value) {-->
<!--                if (value) {-->
<!--                    return moment(String(value)).format('MM/DD/YYYY')-->
<!--                }-->
<!--            },-->

<!--            trunc(n) {-->
<!--                return (n && n.length > 15) ? n.substr(0, 10) + '...' : n-->
<!--            },-->
<!--            searchData1(e) {-->
<!--                console.log('searchDate');-->
<!--                this.contactfilterPage = 1-->
<!--                this.contactloadMore = true-->
<!--                this.contactSearch = e.target.value;-->
<!--                this.allfilteredContacts()-->
<!--            }-->
<!--        }-->
<!--    }-->

<!--</script>-->

<!--<style scoped>-->
<!--    .active {-->
<!--        background-color: #39A7DE;-->
<!--    }-->
<!--    .srch_bar .input-group-addon {-->
<!--        margin: 0 0 0 -27px;-->
<!--        padding-left: 2rem;-->
<!--    }-->
<!--    .container{max-width:1170px; margin:auto;}-->
<!--    img{ max-width:100%;}-->
<!--    .inbox_people {-->
<!--        background: #f8f8f8 none repeat scroll 0 0;-->
<!--        float: left;-->
<!--        overflow: hidden;-->
<!--        border-right:1px solid #c4c4c4;-->
<!--    }-->
<!--    .inbox_msg {-->
<!--        border: 1px solid #c4c4c4;-->
<!--        clear: both;-->
<!--        overflow: hidden;-->
<!--    }-->
<!--    .top_spac{ margin: 20px 0 0;}-->


<!--    .recent_heading {float: left; width:40%;}-->
<!--    .srch_bar {-->
<!--        display: inline-block;-->
<!--        text-align: right;-->
<!--        width: 60%;-->
<!--    }-->
<!--    .headind_srch{ padding:10px 29px 10px 20px; overflow:hidden; border-bottom:1px solid #c4c4c4;}-->

<!--    .recent_heading h4 {-->
<!--        color: #05728f;-->
<!--        font-size: 21px;-->
<!--        margin: auto;-->
<!--    }-->
<!--    .srch_bar input{ border:1px solid #cdcdcd; border-width:0 0 1px 0; width:80%; padding:2px 0 4px 6px; background:none;}-->
<!--    .srch_bar .input-group-addon button {-->
<!--        background: rgba(0, 0, 0, 0) none repeat scroll 0 0;-->
<!--        border: medium none;-->
<!--        padding: 0;-->
<!--        color: #707070;-->
<!--        font-size: 18px;-->
<!--    }-->
<!--    .srch_bar .input-group-addon { margin: 0 0 0 -27px;}-->

<!--    .chat_ib h5{ font-size:15px; color:#464646; margin:0 0 8px 0;}-->
<!--    .chat_ib h5 span{ font-size:13px; float:right;}-->
<!--    .chat_ib p{ font-size:14px; color:#989898; margin:auto}-->
<!--    .chat_img {-->
<!--        float: left;-->
<!--        width: 11%;-->
<!--    }-->
<!--    .chat_ib {-->
<!--        float: left;-->
<!--        padding: 0 0 0 15px;-->
<!--        width: 88%;-->
<!--    }-->

<!--    .chat_people{ overflow:hidden; clear:both;}-->
<!--    .chat_list {-->
<!--        border-bottom: 1px solid #c4c4c4;-->
<!--        margin: 0;-->
<!--        padding: 18px 16px 10px;-->
<!--    }-->
<!--    .inbox_chat { height: 550px; overflow-y: scroll;}-->

<!--    .active_chat{ background:#ebebeb;}-->

<!--    .incoming_msg_img {-->
<!--        display: inline-block;-->
<!--        width: 6%;-->
<!--    }-->
<!--    .received_msg {-->
<!--        display: inline-block;-->
<!--        padding: 0 0 0 10px;-->
<!--        vertical-align: top;-->
<!--        width: 92%;-->
<!--    }-->
<!--    .received_withd_msg p {-->
<!--        background: #ebebeb none repeat scroll 0 0;-->
<!--        border-radius: 3px;-->
<!--        color: #646464;-->
<!--        font-size: 14px;-->
<!--        margin: 0;-->
<!--        padding: 5px 10px 5px 12px;-->
<!--        width: 100%;-->
<!--    }-->
<!--    .time_date {-->
<!--        color: #747474;-->
<!--        display: block;-->
<!--        font-size: 12px;-->
<!--        margin: 8px 0 0;-->
<!--    }-->
<!--    .received_withd_msg { width: 57%;}-->
<!--    .mesgs {-->
<!--        float: left;-->
<!--        padding: 30px 15px 0 25px;-->
<!--        width: 60%;-->
<!--    }-->

<!--    .sent_msg p {-->
<!--        background: #05728f none repeat scroll 0 0;-->
<!--        border-radius: 3px;-->
<!--        font-size: 14px;-->
<!--        margin: 0; color:#fff;-->
<!--        padding: 5px 10px 5px 12px;-->
<!--        width:100%;-->
<!--    }-->
<!--    .outgoing_msg{ overflow:hidden; margin:26px 0 26px;}-->
<!--    .sent_msg {-->
<!--        float: right;-->
<!--        width: 46%;-->
<!--    }-->
<!--    .input_msg_write input {-->
<!--        background: rgba(0, 0, 0, 0) none repeat scroll 0 0;-->
<!--        border: medium none;-->
<!--        color: #4c4c4c;-->
<!--        font-size: 15px;-->
<!--        min-height: 48px;-->
<!--        width: 100%;-->
<!--    }-->

<!--    .type_msg {border-top: 1px solid #c4c4c4;position: relative;}-->
<!--    .msg_send_btn {-->
<!--        background: #05728f none repeat scroll 0 0;-->
<!--        border: medium none;-->
<!--        border-radius: 50%;-->
<!--        color: #fff;-->
<!--        cursor: pointer;-->
<!--        font-size: 17px;-->
<!--        height: 33px;-->
<!--        position: absolute;-->
<!--        right: 0;-->
<!--        top: 11px;-->
<!--        width: 33px;-->
<!--    }-->
<!--    .messaging { padding: 0 0 50px 0;}-->
<!--    .msg_history {-->
<!--        height: 516px;-->
<!--        overflow-y: auto;-->
<!--    }-->
<!--</style>-->
