<template>
  <div>
    <div style="display: flex;align-items: center;">
      <h1>Welcome to the Cron Job.</h1>
      <button @click="toggleModal">Schedule a new cron job</button>
    </div>
    <table class="table">
      <thead>
      <tr>
        <th>Number</th>
        <th>URL</th>
        <th>Interval</th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="cronList.length" v-for="(item, index) in cronList" :key="index">
        <td>{{ item.id }}</td>
        <td>{{ item.url }}</td>
        <td>{{ item.interval }}</td>
        <td>
          <button @click="deleteItem(item.id)">Delete</button>
        </td>
      </tr>
      <tr v-else>
        <td colspan="4" style="text-align: center">No Data Found.</td>
      </tr>
      </tbody>
    </table>

    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <span class="close" @click="toggleModal">&times;</span>
        <h2>Schedule a cron job</h2>
        <hr>
        <form @submit.prevent="submit" style="margin-top: 20px">
          <div style="width: 100px">
            <label>Enter URL</label>
          </div>
          <div style="width: auto">
            <div>
              <input
                  style="width: 50%"
                  v-model="state.url"
                  placeholder="Enter your url"
              />
            </div>
            <div>
              <span v-if="errors.url" class="error">{{ errors.url }}</span>
            </div>
          </div>
          <div style="width: 100px;margin-top: 10px">
            <label>Interval</label>
          </div>
          <div style="width: auto">
            <select v-model="state.interval" style="width: 50%">
              <option value="">Select Interval</option>
              <option value="1">Every Minute</option>
              <option value="2">Every Five Minute</option>
              <option value="3">Every Fifteen Minute</option>
              <option value="4">Every Thirty Minute</option>
              <option value="5">Hourly</option>
              <option value="6">Every Two Hours</option>
              <option value="7">Every Three Hours</option>
              <option value="8">Every Four Hours</option>
              <option value="9">Every Six Hours</option>
              <option value="10">Daily</option>
              <option value="11">Weekly</option>
              <option value="12">Monthly</option>
              <option value="13">Quarterly</option>
              <option value="14">Yearly</option>
            </select>
          </div>
          <div>
            <span v-if="errors.interval" class="error">{{ errors.interval }}</span>
          </div>
          <div style="margin-top: 10px">
            <button type="submit" style="float: right">Schedule</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script>

import axios from './../plugins/axios'

export default {
  data(){
    return {
      errors: {},
      showModal:false,
      state:{url:"",interval:""},
      cronList : []
    }
  },
  mounted() {
    axios.get('/cron-job').then(res => {
      this.cronList = res.data.status ? res.data.data : [];
    });
  },
  methods: {
    toggleModal(){
      this.showModal = !this.showModal;
    },
    deleteItem(id){
      if(confirm('Are you sure to delete this cron?')){
        axios.delete(`/cron-job/${id}`).then(res => {
          alert(res.data.message);
          this.cronList = res.data.status ? this.cronList.filter((data) => data.id != id) : [];
        });
      }
    },
    submit(){
      if (this.validateForm()) {
        axios.post('/cron-job',this.state).then(res => {
          if(res.status){
            this.state = {url:"",interval:""};
            this.cronList.push(res.data.data);
            this.toggleModal();
            alert(res.data.message);
          }
        });
      }
    },
    validateForm() {
      this.errors = {};

      if (!this.state.url) {
        this.errors.url = 'Url is required';
      } else if (!this.isValidUrl(this.state.url)) {
        this.errors.url = 'Invalid url format';
      }

      if (!this.state.interval) {
        this.errors.interval = 'Please select an interval';
      }

      return Object.keys(this.errors).length === 0;
    },
    isValidUrl(url) {
      const urlRegex = /^(?:https?:\/\/)?(?:www\.)?[\w.-]+\.[a-zA-Z]{2,}(?:\/\S*)?$/;
      return urlRegex.test(url);
    }
  }
}

</script>

<style scoped>

  .is-invalid {
    border-color: red;
  }

  .error {
    color: red;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
  }

  .table th,
  .table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  .table th {
    background-color: #f2f2f2;
  }

  .table th:first-child,
  .table td:first-child {
    border-left: none;
  }

  .table th:last-child,
  .table td:last-child {
    border-right: none;
  }

  .modal {
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  }

  /* Modal content */
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    width: 30%; /* Could be more or less, depending on screen size */
  }

  /* Close button */
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }

  /* Form styling */
  form {
    display: flex;
    flex-direction: column;
  }

  label {
    margin-bottom: 5px;
  }

  input, select {
    /*margin-bottom: 10px;*/
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    padding: 10px;
    border: none;
    background-color: #007bff;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
</style>