<template>
  <div>
    <v-menu
      ref="menu"
      v-model="menu"
      v-bind="mergedMenuProps"
      :disabled="readonly || disabled"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-mask="maskString"
          v-bind="mergedTextFieldProps"
          v-model="textFieldDate"
          v-on="on"
          @blur="verifyDate"
        />
      </template>
      <v-date-picker
        v-bind="datePickerProps"
        v-model="datePickerDate"
        @input="menu = false"
      />
    </v-menu>
  </div>
</template>

<script>
import { mask } from "vue-the-mask";
import dayjs from "dayjs";
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

export default {
  props: {
    menuProps: {
      type: Object,
      default: () => {
        return {};
      },
      required: true
    },
    textFieldProps: {
      type: Object,
      default: () => {
        return {};
      },
      required: true
    },
    datePickerProps: {
      type: Object,
      default: () => {
        return {};
      },
      required: true
    },
    value: { required: true },
    readonly: { type: Boolean, default: false },
    label: { type: String },
    disabled: { type: Boolean, default: false },
    modelFormat: { type: [String], default: "YYYY-MM-DDTHH:mm:ssZ" },
    emptyValue: {
      type: [String],
      validator: val => ["", null].includes(val),
      default: null
    },
    displayFormat: { type: String, default: "MM/DD/YYYY" },
    aliases: { type: Object, default: () => ({}) },
    error: { type: Boolean },
    errorMessages: { type: Array }
  },
  directives: { mask },
  data() {
    return {
      menu: false,
      datepickerFormat: "YYYY-MM-DD"
    };
  },
  methods: {
    verifyDate() {
      this.errorMessages = [];
      const date = dayjs(this.textFieldDate, this.displayFormat);
      if (!date.isValid()) {
        this.errorMessages.push("Date is invalid");
        return;
      }
      if (
        this.datePickerProps.allowedDates &&
        !this.datePickerProps.allowedDates(date)
      ) {
        this.$emit("error:notAllowedDate");
        return;
      }
    }
  },
  computed: {
    maskString() {
      return this.displayFormat.replace(/[^\W]/g, "#");
    },
    textFieldDate: {
      get() {
        let date = dayjs(this.value, this.modelFormat);
        if (this.aliases[this.value]) return this.aliases[this.value];
        if (date.isValid()) return date.format(this.displayFormat);
        return this.value;
      },
      set(dateString) {
        let value = dateString;
        let date = dayjs(dateString, this.displayFormat);
        if (this.aliases[dateString]) {
          value = this.aliases[this.value];
        } else if (["", null, undefined].includes(dateString)) {
          value = this.emptyValue;
        } else if (date.isValid()) {
          value = date.format(this.modelFormat);
        }
        this.$emit("input", value);
      }
    },
    datePickerDate: {
      get() {
        let date = dayjs(this.value, this.modelFormat);
        if (!date.isValid()) date = dayjs();
        return date.format(this.datepickerFormat);
      },
      set(dateString) {
        let date = dayjs(dateString, this.datepickerFormat);
        if (date.isValid()) this.$emit("input", date.format(this.modelFormat));
      }
    },
    mergedTextFieldProps() {
      return Object.assign(
        {
          hint: this.displayFormat,
          maxlength: this.displayFormat.length,
          label: this.label,
          disabled: this.disabled,
          readonly: this.readonly,
          "error-messages": this.errorMessages,
          error: this.error,
          autocomplete: "off", // disable autocomplete
          type: "search", // disable autofill
          name: "formattedDate" // disable autofill
        },
        this.textFieldProps
      );
    },
    mergedMenuProps() {
      return Object.assign(
        {
          readonly: this.readonly,
          disabled: this.disabled
        },
        this.menuProps
      );
    }
  }
};
</script>
