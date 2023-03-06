<template>
    <el-aside width="200px" style="background-color: #eef3ff;height:100%">
        <el-menu :default-actice="this.$route.path" router :default-openeds="opends" background-color="#eef3ff">
            <el-submenu v-for="item in this.$router.options.routes.filter(e => {
                return e.name == type
            })[0].children" :index="item.path" :key="item.path">
                <template slot="title"><i class="el-icon-menu"></i>{{ item.name }}</template>
                <div v-if="item.children">
                    <el-menu-item v-for="item1 in (item.children.filter(temp => {
                        return temp.isShow
                    }))" :index="item1.path" :key="item1.path">
                        <i class="el-icon-s-promotion"></i>{{ item1.name }}
                    </el-menu-item>
                </div>
            </el-submenu>
        </el-menu>
    </el-aside>
</template>

<script>
export default {
    props: {
        type: String
    },
    created: function () {
        this.$router.options.routes.filter(e => {
            return e.name == this.type
        })[0].children.forEach(e => {
            this.opends.push(e.path)
        })
        console.log(this.opends)
        // alert(this.$router.options.routes.filter(e => {
        //     return e.name == 'admin'
        // })[0].children[0].path)
        // let arr = this.$router.options.routes.filter(e => {
        //     return e.name == 'admin'
        // })
        // alert(JSON.stringify(arr))
    },
    data() {
        return {
            opends: ["/"]
        }
    }
}
</script>

<style>

</style>