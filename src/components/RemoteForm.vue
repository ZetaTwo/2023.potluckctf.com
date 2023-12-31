<template>
  <template v-for="(field, index) in form.fields" :key="field.name">
    <div v-if="checkVisible(field)" :class="{'form-input-margin': index !== 0 && field.widget.name !== 'SelectOther'}">
      <template v-if="field.widget.name === 'TextInput'">
        <div class="input-text">
          <p>{{ field.label }}</p>
          <small>{{ field.help_text }}</small>
        </div>
        <input
          :id="field.name"
          v-model="answers[field.name]"
          class="textbox"
          type="text"
          :name="field.name"
          v-bind="field.widget.attrs"
        >
      </template>
      <template v-else-if="field.widget.name === 'NumberInput'">
        <div class="input-text">
          <p>{{ field.label }}</p>
          <small>{{ field.help_text }}</small>
        </div>
        <input
          :id="field.name"
          v-model="answers[field.name]"
          class="textbox"
          type="number"
          :name="field.name"
          v-bind="field.widget.attrs"
          @keypress="onlyNumber"
        >
      </template>
      <template v-else-if="field.widget.name === 'Textarea'">
        <div class="input-text">
          <p>{{ field.label }}</p>
          <small>{{ field.help_text }}</small>
        </div>
        <textarea
          :id="field.name"
          v-model="answers[field.name]"
          class="textbox"
          :name="field.name"
          v-bind="field.widget.attrs"
        />
      </template>
      <template v-else-if="field.widget.name === 'SelectOther'">
        <input
          :id="field.name+'-checkbox'"
          v-model="answers[field.name+'-checkbox']"
          type="checkbox"
        >
        <label :for="field.name+'-checkbox'">Annat: </label>
        <input
          :id="field.name"
          v-model="answers[field.name]"
          class="select-other textbox"
          type="text"
          :name="field.name"
          v-bind="field.widget.attrs"
          :disabled="!answers[field.name+'-checkbox']"
        >
      </template>
      <template v-else-if="field.widget.name === 'RadioYesNo'">
        <div class="input-text">
          <p>{{ field.label }}</p>
          <small>{{ field.help_text }}</small>
        </div>
        <label class="checkbox-label" :for="field.name+'-yes'"><input
          :id="field.name+'-yes'"
          v-model="answers[field.name]"
          type="radio"
          :name="field.name"
          value="true"
        >Ja</label>
        <label class="checkbox-label" :for="field.name+'-no'"><input
          :id="field.name+'-no'"
          v-model="answers[field.name]"
          type="radio"
          :name="field.name"
          value="false"
        >Nej</label>
      </template>
      <template v-else-if="field.widget.name === 'RadioSelect'">
        <div class="input-text">
          <p>{{ field.label }}</p>
          <small>{{ field.help_text }}</small>
        </div>
        <template v-for="choice in field.widget.choices" :key="choice[0]">
          <label class="checkbox-label" :for="field.name+choice[0]"><input
            :id="field.name+choice[0]"
            v-model="answers[field.name]"
            type="radio"
            :name="choice[0]"
            :value="choice[0]"
          > {{ choice[1] }}</label>
        </template>
      </template>
      <template v-else-if="field.widget.name === 'CheckboxSelectMultiple'">
        <div class="input-text">
          <p>{{ field.label }}</p>
          <small>{{ field.help_text }}</small>
        </div>
        <template v-for="choice in field.widget.choices" :key="choice[0]">
          <label class="checkbox-label" :for="field.name+choice[0]"><input
            :id="field.name+choice[0]"
            v-model="answers[field.name]"
            type="checkbox"
            :name="choice[0]"
            :value="choice[0]"
          > {{ choice[1] }}</label>
        </template>
      </template>
      <template v-else>
        widget not implemented
        {{ field }}
      </template>
      <template v-for="error in field.errors" :key="error">
        <p class="error">
          {{ error }}
        </p>
      </template>
    </div>
  </template>
  <input
    v-if="form.fields"
    class="button"
    type="button"
    :value="buttonText"
    @click="handleSubmit"
  >
  <template v-for="error in form.non_field_errors" :key="error">
    <p class="error">
      {{ error }}
    </p>
  </template>
</template>

<script>
export default {
    props: { form: { default: [] }, buttonText: { default: 'Submit' } },
    emits: ['submit'],
    data () {
        return {
            answers: {},
        }
    },
    computed: {
        cleanedAnswers () {
            const obj = {}

            for (const i in this.form.fields) {
                const field = this.form.fields[i]
                switch (field.widget.name) {
                case 'TextInput':
                    obj[field.name] = this.answers[field.name] || ''
                    break
                case 'NumberInput':
                    obj[field.name] = this.answers[field.name] || null
                    break
                case 'Textarea':
                    obj[field.name] = this.answers[field.name] || ''
                    break
                case 'SelectOther':
                    obj[field.name] = (this.answers[field.name + '-checkbox']) ? this.answers[field.name] || '' : ''
                    break
                case 'RadioYesNo':
                    if (this.answers[field.name] === undefined) {
                        obj[field.name] = null
                        break
                    }
                    obj[field.name] = this.answers[field.name] === 'true'
                    break
                case 'RadioSelect':
                    if (this.answers[field.name] === undefined) {
                        obj[field.name] = null
                        break
                    }
                    obj[field.name] = this.answers[field.name]
                    break
                case 'CheckboxSelectMultiple':
                    obj[field.name] = this.answers[field.name]
                    break
                default:
                    console.error('unknown widget ' + field.widget.name)
                }
            }

            return obj
        },
    },
    watch: {
        'form' (newForm, oldForm) {
            if (oldForm.fields === []) {
                this.init()
            }
            this.fillInits()
        },
    },
    mounted () {
        this.init()
        this.fillInits()
    },
    methods: {
        handleSubmit () {
            this.$emit('submit', this.cleanedAnswers)
        },
        checkVisible (field) {
            return !(field.requires && this.cleanedAnswers[field.requires[0]] !== field.requires[1])
        },
        init () {
            for (const i in this.form.fields) {
                switch (this.form.fields[i].widget.name) {
                case 'CheckboxSelectMultiple':
                    this.answers[this.form.fields[i].name] = []
                    break
                }
            }
        },
        fillInits () {
            for (const i in this.form.fields) {
                if (this.form.fields[i].initial) {
                    this.answers[this.form.fields[i].name] = this.form.fields[i].initial
                }
            }
        },
        onlyNumber: function (event) {
            event = (event) || window.event
            const charCode = (event.which) ? event.which : event.keyCode
            if (charCode < 48 || charCode > 57) {
                event.preventDefault()
            } else {
                return true
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.input-text {
    margin-bottom: 0.5rem;
    p {
        margin-bottom: 0rem;
    }
}

.form-input-margin {
    margin-top: 1.5rem;
}

.checkbox-label {
    display: block;
}

.button {
    margin: 1rem 0;
}

.error {
    color: rgb(190, 30, 30);
    margin: 0;
}
</style>
