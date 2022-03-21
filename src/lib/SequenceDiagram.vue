<template>
    <div ref="seqdiagram" class="seqdiagram">
        <!-- content -->
        <div class="seqdiagram_sysbox">
            <!-- column -->
            <div
                v-for="(column, index) in columnList"
                class="subsys"
                ref="subsys"
                :key="column.name"
                :name="'subsys' + index"
            >
                <div class="title">{{ column.name }}</div>
                <div class="bodybox">
                    <!-- The first segment reserved line -->

                    <div class="segment-line"></div>

                    <!-- Calculate other segments in a loop -->

                    <template v-for="(segment, segIndex) in column['segments']">
                        <div
                            v-if="segment.isBlock"
                            :key="index + '-' + segIndex"
                            class="segment-block"
                            :style="{
                                flex: segment.end - segment.begin + 1,
                                backgroundColor: column.color,
                            }"
                        ></div>
                        <div
                            v-if="!segment.isBlock"
                            :key="index + '-' + segIndex"
                            class="segment-line"
                            :style="{ flex: segment.end - segment.begin + 1 }"
                        ></div>
                    </template>

                    <!-- The last segment reserved line -->

                    <div class="segment-line"></div>
                </div>
                <div class="title">{{ column.name }}</div>
            </div>
        </div>
        <!-- line -->
        <template v-for="(line, index) in rowList">
            <!-- A->B -->
            <div
                v-if="line['fromColumnIdx'] < line['toColumnIdx']"
                ref="line"
                @click="$emit('line-click', index, line)"
                :key="'line-' + index"
                class="arrow_line"
                :style="lineStyles[index]"
            >
                <div :class="line['lineType']"></div>
                <div class="arrow_to_right"></div>
                <div class="note">{{ line.note }}</div>
                <!-- label -->
                <div class="line_label" :style="labelStyles[index]">
                    {{ line["label"] }}
                </div>
            </div>
            <!-- A<-B -->
            <div
                v-if="line['fromColumnIdx'] > line['toColumnIdx']"
                ref="line"
                @click="$emit('line-click', index, line)"
                :key="'line-' + index"
                class="arrow_line"
                :style="lineStyles[index]"
            >
                <div class="arrow_to_left"></div>
                <div :class="line['lineType']"></div>
                <div class="note">{{ line.note }}</div>
                <!-- label -->
                <div class="line_label" :style="labelStyles[index]">
                    {{ line["label"] }}
                </div>
            </div>
            <!-- A->A -->
            <div
                v-if="line['fromColumnIdx'] == line['toColumnIdx']"
                ref="line"
                @click="$emit('line-click', index, line)"
                :key="'line-' + index"
                class="self_msg_line"
                :style="lineStyles[index]"
            >
                <div :class="line['lineType']"></div>
                <div class="arrow"></div>
                <div class="note">{{ line.note }}</div>
                <!-- label -->
                <div class="line_label" :style="labelStyles[index]">
                    {{ line["label"] }}
                </div>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'SequenceDiagram',
    props: {
        // data [{label:'',from:'',to:'',note:'',isDash:1}]
        dataList: {
            type: Array
        }
    },
    data() {
        return {
            // information for all data rows
            rowList: [],
            // information for all columns{data:{},fromColumnIdx:1,toColumnIdx:2,sys_idx}
            columnList: [],

            colorList: [
                'SteelBlue',
                'coral',
                'DeepSkyBlue',
                'lightgreen',
                'SlateBlue',
                'HotPink',
                'Olive',
                'Sienna',
                'Tan'
            ],
            lineStyles: [],
            labelStyles: [],
            resizeFunction: null
        }
    },
    created() {
        // Loop through all data rows, calculating column information
        for ( var i = 0; i < this.dataList.length; ++i ) {
            // copy the original data object passed by the user, saved to rowList
            var line = Object.assign( {}, this.dataList[ i ] )
            this.rowList.push( line )

            if ( line[ 'from' ] === line[ 'to' ] ) {
                // -------------self-loop, from A->A-----------------
                var columnIndex = this._ensureColumnIndex( line[ 'name' ] )
                this.columnList[ columnIndex ][ 'rowNumbers' ].push( i )
                // Supplement self-loop data, the index of the column where it is located
                line[ 'fromColumnIdx' ] = columnIndex
                line[ 'toColumnIdx' ] = columnIndex
                // line type
                line[ 'lineType' ] = line[ 'isDash' ] ? 'dashlink' : 'link'
            } else {
                // -------------normal information, from A->B-----------------
                // Record column information and return the index position of the column
                var fromColumnIndex = this._ensureColumnIndex( line[ 'from' ] )
                // record the current line
                this.columnList[ fromColumnIndex ][ 'rowNumbers' ].push( i )

                // Add the index of the column where from is located
                line[ 'fromColumnIdx' ] = fromColumnIndex

                // to Related Information
                var toColumnIndex = this._ensureColumnIndex( line[ 'to' ] )
                this.columnList[ toColumnIndex ][ 'rowNumbers' ].push( i )
                line[ 'toColumnIdx' ] = toColumnIndex
                // line type
                line[ 'lineType' ] = line[ 'isDash' ] ? 'dashline' : 'line'
            }
        }
        // Calculate segmentation information for all columns
        for ( var i = 0; i < this.columnList.length; ++i ) {
            this._generateColumnSegment( this.columnList[ i ] )
        }
    },
    mounted() {
        this.$nextTick( () => {
            this.reCalculateLinePosition()
        } )
        const that = this
        this.resizeFunction = function () {
            that.reCalculateLinePosition()
        }
        // Increase monitoring

        window.addEventListener( 'resize', this.resizeFunction )
    },
    beforeDestroy() {
        // Remove monitor

        window.removeEventListener( 'resize', this.resizeFunction )
    },
    methods: {
        /**
         * According to the column name, calculate the information of the column and return the index of the column，
         */
        _ensureColumnIndex( columnName ) {
            for ( var j = 0; j < this.columnList.length; ++j ) {
                if ( this.columnList[ j ][ 'name' ] == columnName ) {
                    return j
                }
            }
            var idx = this.columnList.length
            this.columnList.push( {
                idx: idx,
                name: columnName,
                color: this.colorList[ idx % this.colorList.length ],
                rowNumbers: []
            } )
            // Returns the index of the column
            return idx
        },
        /**
         * Calculated column segmentation style
         */
        _generateColumnSegment( columnItem ) {
            columnItem[ 'segments' ] = []
            // calculate dots
            var bitmap = []
            // All rows default to 0
            for ( var i = 0; i < this.dataList.length; ++i ) {
                bitmap.push( 0 )
            }
            // columnItem['rowNumbers']=[1,8]
            // Explain that the current column is displayed in
            // the second row and the 9th rowblock

            for ( var i = 0; i < columnItem[ 'rowNumbers' ].length; ++i ) {
                // 1代表当前段为block 0代表line
                bitmap[ columnItem[ 'rowNumbers' ][ i ] ] = 1
            }
            // 计算连续的block和line
            var segStart = 0,
                isBlock = false
            for ( var i = 0; i < bitmap.length; ++i ) {
                if ( bitmap[ i ] ) {
                    // this dot belongs to a line block seg
                    if ( !isBlock ) {
                        // but current seg is not a block
                        if ( i > segStart ) {
                            // end current seg
                            columnItem[ 'segments' ].push( {
                                begin: segStart,
                                end: i - 1,
                                isBlock: false
                            } )
                        }
                        // start a new seg
                        segStart = i
                        isBlock = true
                    }
                } // this dot belongs to a dash line seg
                else {
                    if ( isBlock ) {
                        // but current seg is a block
                        if ( i > segStart ) {
                            // end current seg
                            columnItem[ 'segments' ].push( {
                                begin: segStart,
                                end: i - 1,
                                isBlock: true
                            } )
                        }
                        // start a new seg
                        segStart = i
                        isBlock = false
                    }
                }
            }
            // end the final line seg
            columnItem[ 'segments' ].push( {
                begin: segStart,
                end: bitmap.length - 1,
                isBlock: isBlock
            } )
        },
        /**
         * Recalculate the position of the line
         */
        reCalculateLinePosition() {
            // console.log('===========recal_line===========')
            if ( this.rowList.length === 0 ) {
                return
            }
            // var dom = this.$refs.seqdiagram
            // var baseOffset = {
            //   left: dom.offsetLeft,
            //   top: dom.offsetTop
            // }
            var baseOffset = {
                left: 0,
                top: 0
            }

            // segment block

            var segBlockDom = document.querySelector( '[name=subsys0] .segment-block' )
            if ( !segBlockDom ) {
                return
            }

            // segment block width

            var segBlockWidth = segBlockDom.clientWidth

            // Column height

            var columnBodyDom = document.querySelector( '[name=subsys0] .bodybox' )

            // Clear original style

            this.lineStyles.length = 0
            this.labelStyles.length = 0
            for ( var i = 0; i < this.rowList.length; ++i ) {
                var line = this.rowList[ i ]
                var lineDom = this.$refs.line[ i ]

                var width = 0,
                    top = 0,
                    left = 0

                // calculate top

                var segCount = this.rowList.length + 1
                var avgSegheight = columnBodyDom.offsetHeight / segCount
                var columnBodyTop = columnBodyDom.offsetTop

                // A->A Types of

                if ( line[ 'fromColumnIdx' ] === line[ 'toColumnIdx' ] ) {
                    var columnDom = this.$refs.subsys[ line[ 'fromColumnIdx' ] ]

                    var leftPosition =
                        columnDom.offsetLeft + columnDom.clientWidth / 2 + segBlockWidth / 2

                    // postion

                    width = columnDom.clientWidth
                    top = columnBodyTop + ( i + 1 ) * avgSegheight - 5 - baseOffset.top
                    left = leftPosition - baseOffset.left
                } else {
                    // A->B OR B->A
                    // Start column dom

                    var fromDom = this.$refs.subsys[ line[ 'fromColumnIdx' ] ]

                    // End of the column dom

                    var toDom = this.$refs.subsys[ line[ 'toColumnIdx' ] ]

                    var leftDom = null,
                        rightDom = null
                    if ( line[ 'fromColumnIdx' ] < line[ 'toColumnIdx' ] ) {
                        // line is left to right

                        leftDom = fromDom
                        rightDom = toDom
                    } else {
                        // line is right to left

                        leftDom = toDom
                        rightDom = fromDom
                    }
                    // calculate line's left and right end position, calculate width

                    var leftPosition =
                        leftDom.offsetLeft + leftDom.clientWidth / 2 + segBlockWidth / 2
                    var rightPosition =
                        rightDom.offsetLeft + rightDom.clientWidth / 2 - segBlockWidth / 2

                    // set up position

                    width = rightPosition - leftPosition
                    top = columnBodyTop + ( i + 1 ) * avgSegheight - 5 - baseOffset.top
                    left = leftPosition - baseOffset.left
                }

                // record position

                this.lineStyles.push( {
                    width: width + 'px',
                    top: top + 'px',
                    left: left + 'px'
                } )

                this.labelStyles.push( {
                    left: -1 * left + 'px'
                } )
            }
        }
    }
}
</script>

<style lang="less" scoped>
@px: 0.0625em;
@small_font_size: 10 * @px;
@midium_font_size: 12 * @px;
@large_font_size: 14 * @px;
@huge_font_size: 16 * @px;
@box_bordercolor: black;
@box_bordercolor_light: gray;
@box_backcolor_begin: #ccc;
@box_backcolor_end: lighten(@box_backcolor_begin, 50%);
@box_backcolor_tips: LemonChiffon;
@box_shadowcolor: darken(@box_backcolor_begin, 10%);
@subsys_maxwidth: 200 * @px;
@color: midnightblue;

@hover_box_bordercolor: red;
@hover_box_backcolor: #ccc;

.seqdiagram {
    margin: 0;
    padding: 0;
    * {
        margin: 0;
        padding: 0;
    }
    color: @color;
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    .seqdiagram_title {
        display: flex;
        font-size: @midium_font_size;
        text-shadow: 2 * @px 2 * @px 2 * @px @box_shadowcolor;
        .box {
            padding: 5 * @px 10 * @px 5 * @px 10 * @px;
            border: @px solid @box_bordercolor_light;
            border-top: 0;
            background-color: @box_backcolor_tips;
        }
        .west {
            border-left: 0;
            border-bottom-right-radius: @huge_font_size;
        }
        .center {
            flex: 1;
        }
        .east {
            border-right: 0;
            border-bottom-left-radius: @huge_font_size;
        }
    }
    .seqdiagram_sysbox {
        display: flex;
        justify-content: space-around;
        position: relative;
        flex: 1;
        .subsys {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            max-width: @subsys_maxwidth;
            margin: @small_font_size;
            .title {
                border: @px solid @box_bordercolor;
                border-radius: 6 * @px;
                padding: 5 * @px;
                text-align: center;
                text-shadow: 2 * @px 2 * @px 2 * @px @box_shadowcolor;
                box-shadow: 4 * @px 4 * @px 4 * @px @box_shadowcolor;
                font-size: @large_font_size;
                background-image: linear-gradient(
                    to bottom,
                    @box_backcolor_begin,
                    @box_backcolor_end
                );
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .bodybox {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                .segment-line {
                    position: relative;
                    top: 0;
                    left: 0;
                    z-index: 0;
                    width: 0;
                    border-left: 1px dashed @box_bordercolor;
                    flex: 0.5;
                }
                .segment-block {
                    width: 10 * @px;
                    background-color: pink;
                    flex: 1;
                    box-shadow: 4 * @px 4 * @px 4 * @px @box_shadowcolor;
                    z-index: 1;
                }
            }
        }
    }
    .seqdiagram_bottom {
        display: flex;
        font-size: @midium_font_size;
        text-shadow: 2 * @px 2 * @px 2 * @px @box_shadowcolor;
        margin: 5 * @px;
        .side {
            flex: 1;
        }
        .center {
            padding: 15 * @px;
            border: @px solid @box_bordercolor_light;
            border-radius: @huge_font_size;
            background-color: @box_backcolor_tips;
        }
    }
    .arrow_line {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        height: @small_font_size;
        z-index: 0;
        width: 200px;
        .line {
            border-bottom: @px solid @box_bordercolor;
            height: 0;
            flex: 1;
        }
        .dashline {
            border-bottom: @px dashed @box_bordercolor;
            height: 0;
            flex: 1;
        }
        .arrow_to_right:before {
            content: "▶";
            color: @box_bordercolor;
        }
        .arrow_to_left:before {
            content: "◀";
            color: @box_bordercolor;
        }
        .note {
            position: absolute;
            margin: auto;
            top: -@huge_font_size;
            left: 0;
            bottom: 0;
            right: 0;
            text-align: center;
            font-size: @large_font_size;
            text-shadow: 2 * @px 2 * @px 2 * @px @box_shadowcolor;
            paddng: 0 8 * @px 0 8 * @px;
            color: dimgray;
        }
    }

    .self_msg_line {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        height: @small_font_size;
        z-index: 0;
        width: 200px;
        .link {
            width: 1.5 * @huge_font_size;
            height: 1.5 * @huge_font_size;
            border: @px solid @box_bordercolor;
            border-left: 0;
        }
        .dashlink {
            width: 1.5 * @huge_font_size;
            height: 1.5 * @huge_font_size;
            border: @px dashed @box_bordercolor;
            border-left: 0;
        }
        .arrow:before {
            content: "◀";
            color: @box_bordercolor;
            position: absolute;
            left: 0;
            bottom: -1.25 * @large_font_size;
        }
        .note {
            flex: 1;
            text-align: left;
            font-size: @large_font_size;
            text-shadow: 2 * @px 2 * @px 2 * @px @box_shadowcolor;
            color: dimgray;
            padding-left: 5 * @px;
        }
    }

    .arrow_line:hover {
        cursor: pointer;
        background: @hover_box_backcolor;
        .line {
            border-bottom: @px solid @hover_box_bordercolor;
        }
        .dashline {
            border-bottom: @px dashed @hover_box_bordercolor;
        }
        .arrow_to_right:before {
            color: @hover_box_bordercolor;
        }
        .arrow_to_left:before {
            color: @hover_box_bordercolor;
        }
        .line_label {
            color: @hover_box_bordercolor;
        }
    }
    .self_msg_line:hover {
        cursor: pointer;
        .link {
            border: @px solid @hover_box_bordercolor;
            border-left: 0;
        }
        .arrow:before {
            color: @hover_box_bordercolor;
        }

        .line_label {
            color: @hover_box_bordercolor;
        }
    }

    .line_label {
        position: absolute;
        font-size: @large_font_size;
        z-index: 0;
        text-align: left;
    }
}
</style>
